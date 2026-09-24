#!/usr/bin/env bash
set -euo pipefail

# Package-only firmware assembly. No router configuration or keys are included.
release=25.12.5
target=mediatek
subtarget=filogic
profile=xiaomi_redmi-router-ax6000-stock
awg_tag=awg3.1-25.12.5-mediatek-filogic-aarch64_cortex-a53
base_url="https://downloads.openwrt.org/releases/${release}/targets/${target}/${subtarget}"
ib_name="openwrt-imagebuilder-${release}-${target}-${subtarget}.Linux-x86_64.tar.zst"
ib_sha=7fb6cf626582ebcbfb46974da48c1eae577213f38879eaf6b1d982041e843461
work_dir="$(mktemp -d "${RUNNER_TEMP:-/tmp}/ax6000-image.XXXXXXXX")"
dist_dir="${GITHUB_WORKSPACE}/dist"
mkdir -p "${dist_dir}" "${work_dir}/imagebuilder" "${work_dir}/downloads"

curl -fL --retry 3 --output "${work_dir}/${ib_name}" "${base_url}/${ib_name}"
printf '%s  %s\n' "${ib_sha}" "${work_dir}/${ib_name}" | sha256sum -c -
tar -I zstd -xf "${work_dir}/${ib_name}" -C "${work_dir}/imagebuilder"
ib_root="$(find "${work_dir}/imagebuilder" -mindepth 1 -maxdepth 1 -type d -name 'openwrt-imagebuilder-*' -print -quit)"
test -n "${ib_root}"
test -x "${ib_root}/staging_dir/host/bin/apk"

download_awg() {
  local package="$1" expected_sha="$2" asset file_name actual_name actual_version metadata
  asset="openwrt-awg3.1_25.12.5_mediatek_filogic_aarch64_cortex-a53-${package}.apk"
  file_name="${work_dir}/downloads/${asset}"
  curl -fL --retry 3 --output "${file_name}" \
    "https://github.com/kaseat/awg-openwrt-builder/releases/download/${awg_tag}/${asset}"
  printf '%s  %s\n' "${expected_sha}" "${file_name}" | sha256sum -c -
  metadata="$("${ib_root}/staging_dir/host/bin/apk" adbdump "${file_name}")"
  actual_name="$(awk '$1 == "name:" {print $2; exit}' <<< "${metadata}")"
  actual_version="$(awk '$1 == "version:" {print $2; exit}' <<< "${metadata}")"
  test "${actual_name}" = "${package}"
  test -n "${actual_version}"
  if [ "${package}" = kmod-amneziawg ]; then
    grep -qF 'kernel=6.12.94~5a6c1f71be683ae9980b15d3ce73e24d-r1' <<< "${metadata}"
  fi
  cp "${file_name}" "${ib_root}/packages/${actual_name}-${actual_version}.apk"
  echo "Local package: ${actual_name}-${actual_version}.apk"
}

download_awg amneziawg-tools fb49b4517a87da1cff0301380879b8c85925f717321e439c44d565467ef03ebc
download_awg kmod-amneziawg 820d91840f8df33589c65626f9bd2070fcc0d577c8ec1724a1a96aea13d7a407
download_awg luci-proto-amneziawg d6d8e1c75c8d0809a1afa7e2de09ba09ecda523dba2ce31fa306cfafefee7852

# Preserve the router's essential package set, but restore all configuration
# separately from backup after flashing. iperf3 is diagnostic-only.
packages='-dnsmasq dnsmasq-full luci luci-ssl luci-app-firewall luci-app-package-manager ca-certificates curl coreutils-sha256sum amneziawg-tools kmod-amneziawg luci-proto-amneziawg'
cd "${ib_root}"
make image PROFILE="${profile}" PACKAGES="${packages}" EXTRA_IMAGE_NAME=soncevo-awg31
make manifest PROFILE="${profile}" PACKAGES="${packages}" > "${dist_dir}/installed-packages.manifest"

for package in dnsmasq-full luci luci-ssl ca-certificates curl coreutils-sha256sum amneziawg-tools kmod-amneziawg luci-proto-amneziawg; do
  grep -Eq "^${package}[[:space:]]" "${dist_dir}/installed-packages.manifest"
done
if grep -Eq '^(dnsmasq|iperf3)[[:space:]]' "${dist_dir}/installed-packages.manifest"; then
  echo 'Unexpected dnsmasq or iperf3 package in image' >&2
  exit 1
fi

image_dir="${ib_root}/bin/targets/${target}/${subtarget}"
image="$(find "${image_dir}" -maxdepth 1 -type f -name '*xiaomi_redmi-router-ax6000-stock*sysupgrade.bin' -print -quit)"
test -n "${image}"
cp "${image}" "${dist_dir}/"
cd "${dist_dir}"
sha256sum "$(basename "${image}")" > SHA256SUMS
ls -lh .
