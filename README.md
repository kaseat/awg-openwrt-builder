# awg-openwrt-builder

OpenWrt builder for AmneziaWG packages.

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

## Default build target

- OpenWrt `25.12.2`
- `mediatek/filogic`
- `aarch64_cortex-a53`

## Output layout

Local build output:

```text
dist/<openwrt_release>/<target>-<subtarget>-<pkgarch>/
```

GitHub Actions artifact names:

- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg`

GitHub release assets:

- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.apk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.apk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.apk`

GitHub release title uses the same build id:

- `25.12.2-mediatek-filogic-aarch64-cortex-a53`

## Install on router

This repo targets OpenWrt 25.12 routers with `apk`.

Download the release assets and install them:

```sh
TAG=<release-tag>

curl -L -o /tmp/kmod-amneziawg.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.apk
curl -L -o /tmp/amneziawg-tools.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.apk
curl -L -o /tmp/luci-proto-amneziawg.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.apk

apk add --allow-untrusted \
  /tmp/kmod-amneziawg.apk \
  /tmp/amneziawg-tools.apk \
  /tmp/luci-proto-amneziawg.apk

/etc/init.d/network restart
```

Replace `<release-tag>` with the tag you want to install, for example `25.12.2-mediatek-filogic-aarch64-cortex-a53` or the latest published release.

If you do not need the LuCI interface, install only:

```sh
apk add --allow-untrusted /tmp/kmod-amneziawg.apk /tmp/amneziawg-tools.apk
```

## Build for another router

To build packages for a different OpenWrt router, you need four values:

- `openwrt_release`
- `target`
- `subtarget`
- `pkgarch`

Get them from the router or from the OpenWrt download page for that device.

From the router, run:

```sh
ubus call system board
```

Use the OpenWrt release that matches the firmware on the device. For kernel packages, the release and target must match the router ABI.

Then run the GitHub Actions workflow manually and fill in the inputs:

- `openwrt_release`: for example `25.12.2`
- `target`: for example `mediatek`
- `subtarget`: for example `filogic`
- `pkgarch`: for example `aarch64_cortex-a53`

If your second router is a different family, use its own target/subtarget/pkgarch tuple. The workflow will build the same three packages for that tuple and publish the assets with the corresponding names.

For published releases, use the hyphenated release id as the Git tag:

- `25.12.2-mediatek-filogic-aarch64-cortex-a53`

## Notes

- `luci-proto-amneziawg` is the LuCI protocol/UI package.
- `amneziawg-tools` installs `/lib/netifd/proto/amneziawg.sh` and the `awg` control binary.
- `kmod-amneziawg` is the kernel module that provides the actual tunnel device.
