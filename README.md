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
dist/<openwrt_release>/<target>-<subtarget>/
```

GitHub Actions artifact names:

- `openwrt-25.12.2-mediatek-filogic-kmod-amneziawg`
- `openwrt-25.12.2-mediatek-filogic-amneziawg-tools`
- `openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg`

GitHub release assets:

- `openwrt-25.12.2-mediatek-filogic-kmod-amneziawg.apk`
- `openwrt-25.12.2-mediatek-filogic-amneziawg-tools.apk`
- `openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg.apk`

## Install on router

This repo targets OpenWrt 25.12 routers with `apk`.

Download the release assets and install them:

```sh
TAG=<release-tag>

curl -L -o /tmp/kmod-amneziawg.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2-mediatek-filogic-kmod-amneziawg.apk
curl -L -o /tmp/amneziawg-tools.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2-mediatek-filogic-amneziawg-tools.apk
curl -L -o /tmp/luci-proto-amneziawg.apk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg.apk

apk add --allow-untrusted \
  /tmp/kmod-amneziawg.apk \
  /tmp/amneziawg-tools.apk \
  /tmp/luci-proto-amneziawg.apk

/etc/init.d/network restart
```

Replace `<release-tag>` with the tag you want to install, for example `v0.0.13-test` or the latest published release.

If you do not need the LuCI interface, install only:

```sh
apk add --allow-untrusted /tmp/kmod-amneziawg.apk /tmp/amneziawg-tools.apk
```

## Notes

- `luci-proto-amneziawg` is the LuCI protocol/UI package.
- `amneziawg-tools` installs `/lib/netifd/proto/amneziawg.sh` and the `awg` control binary.
- `kmod-amneziawg` is the kernel module that provides the actual tunnel device.
