# awg-openwrt-builder

OpenWrt builder for AmneziaWG 3.1 packages.

## What it builds

- `kmod-amneziawg`
- `amneziawg-tools`
- `luci-proto-amneziawg`

## What this repo contains

- OpenWrt packaging wrappers for the three packages above.
- GitHub Actions workflow that builds OpenWrt SDK packages.
- Runtime glue for OpenWrt netifd in `amneziawg-tools`.

## What this repo does not contain

- The upstream `amneziawg-linux-kernel-module` source tree.
- The upstream `amneziawg-tools` source tree.
- A full OpenWrt source tree.

## Supported build tuples

The current workflow builds AmneziaWG 3.1 for the OpenWrt 25.12 series.

| OpenWrt | target/subtarget | pkgarch | sdk_variant | package_ext |
|---|---|---|---|---|
| `25.12.x` | `mediatek/filogic` | `aarch64_cortex-a53` | `gcc-14.3.0_musl` | `apk` |

Earlier AWG 2.0 packages for OpenWrt `24.10.2`, `25.12.2`, and `25.12.3` remain in their existing GitHub releases.

## Default build target

- AmneziaWG `3.1` (kernel source `v3.1.20260906`, tools source `v3.1.20260812`)
- OpenWrt `25.12.5`
- `mediatek/filogic`
- `aarch64_cortex-a53`

## Output layout

Local build output:

```text
dist/<openwrt_release>/<target>-<subtarget>-<pkgarch>/
```

GitHub Actions artifact names:

- `openwrt-awg3.1_25.12.5_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg`
- `openwrt-awg3.1_25.12.5_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools`
- `openwrt-awg3.1_25.12.5_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg`

Existing AWG 2.0 GitHub release assets:

- `openwrt-24.10.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.ipk`
- `openwrt-24.10.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.ipk`
- `openwrt-24.10.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.ipk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.apk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.apk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.apk`
- `openwrt-25.12.3_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.apk`
- `openwrt-25.12.3_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.apk`
- `openwrt-25.12.3_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.apk`

The AWG 3.1 release tag and title will use the protocol and build tuple:

- `awg3.1-25.12.5-mediatek-filogic-aarch64_cortex-a53`

## Install on router

AWG 3.1 builds for OpenWrt 25.12.x use `.apk`. Install only packages built for the router's exact firmware and kernel ABI.

After publishing an AWG 3.1 release, download its assets and install them:

```sh
TAG="awg3.1-25.12.5-mediatek-filogic-aarch64_cortex-a53"
BUILD_ID="awg3.1_25.12.5_mediatek_filogic_aarch64_cortex-a53"
PKG_EXT="apk"
```

For another 25.12 release or target, replace the tag and build id with matching values.

```sh

curl -L -o /tmp/kmod-amneziawg.${PKG_EXT} \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-${BUILD_ID}-kmod-amneziawg.${PKG_EXT}
curl -L -o /tmp/amneziawg-tools.${PKG_EXT} \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-${BUILD_ID}-amneziawg-tools.${PKG_EXT}
curl -L -o /tmp/luci-proto-amneziawg.${PKG_EXT} \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-${BUILD_ID}-luci-proto-amneziawg.${PKG_EXT}

if [ "${PKG_EXT}" = "apk" ]; then
  apk add --allow-untrusted \
    /tmp/kmod-amneziawg.${PKG_EXT} \
    /tmp/amneziawg-tools.${PKG_EXT} \
    /tmp/luci-proto-amneziawg.${PKG_EXT}
else
  opkg install \
    /tmp/kmod-amneziawg.${PKG_EXT} \
    /tmp/amneziawg-tools.${PKG_EXT} \
    /tmp/luci-proto-amneziawg.${PKG_EXT}
fi

/etc/init.d/network restart
```

The AWG 3.1 parameters are optional. Leaving them unset keeps an existing AWG 2.0-style configuration; enabling them requires a matching configuration on the remote endpoint.

If you do not need the LuCI interface, install only:

```sh
if [ "${PKG_EXT}" = "apk" ]; then
  apk add --allow-untrusted /tmp/kmod-amneziawg.${PKG_EXT} /tmp/amneziawg-tools.${PKG_EXT}
else
  opkg install /tmp/kmod-amneziawg.${PKG_EXT} /tmp/amneziawg-tools.${PKG_EXT}
fi
```

## Build for another router

To build packages for a different OpenWrt router, you need five values:

- `openwrt_release`
- `target`
- `subtarget`
- `pkgarch`
- `sdk_variant`

Use this order:

1. On the router, run:

   ```sh
   ubus call system board
   ```

   Take:
   - `openwrt_release` from `release.version`
   - `target` from `release.target` before `/`
   - `subtarget` from `release.target` after `/`

2. Open the matching OpenWrt download page for that release and tuple:

   ```text
   https://downloads.openwrt.org/releases/<openwrt_release>/targets/<target>/<subtarget>/
   ```

   Take:
   - `sdk_variant` from the SDK tarball name, for example `gcc-14.3.0_musl` or `gcc-13.3.0_musl`
   - `pkgarch` from the package architecture path under the release, for example `aarch64_cortex-a53`

3. Fill in the GitHub Actions `workflow_dispatch` inputs with those exact values.

Example for a `mediatek/filogic` router on OpenWrt 25.12.5:

- `openwrt_release = 25.12.5`
- `target = mediatek`
- `subtarget = filogic`
- `pkgarch = aarch64_cortex-a53`
- `sdk_variant = gcc-14.3.0_musl`
- `package_ext = apk`

The workflow derives `package_ext` automatically from `openwrt_release`; you do not enter it manually.

For kernel packages, the exact `kernel` ABI dependency in the built `.apk` must match the router firmware's `kernel` package. Matching only the OpenWrt version and CPU architecture is insufficient.

You can also trigger the same build by pushing a Git tag with the tuple name:

- `awg3.1-25.12.5-mediatek-filogic-aarch64_cortex-a53`

The workflow reads the tuple from the tag, derives the SDK variant automatically for the supported releases, and publishes a release with the same tuple name.

## Notes

- `luci-proto-amneziawg` is the LuCI protocol/UI package.
- `amneziawg-tools` installs `/lib/netifd/proto/amneziawg.sh` and the `awg` control binary.
- `kmod-amneziawg` is the kernel module that provides the actual tunnel device.
