# awg-openwrt-builder

Minimal OpenWrt builder for AmneziaWG packages.

What this repo contains:

- GitHub Actions workflow.
- Thin OpenWrt package wrappers.
- Runtime glue for `amneziawg-tools` (`amneziawg.sh` and watchdog helper).
- LuCI protocol support for AmneziaWG.

What this repo does not vendor:

- `amneziawg-linux-kernel-module` source tree.
- `amneziawg-tools` source tree.
- OpenWrt source tree.

Default build target:

- OpenWrt `25.12.2`
- `mediatek/filogic`
- `aarch64_cortex-a53`

The workflow builds:

- `kmod-amneziawg`
- `amneziawg-tools`
- `luci-proto-amneziawg`

Local build output is written under `dist/<openwrt_release>/<target>-<subtarget>/`.
GitHub Actions artifacts follow the same naming scheme, for example:

- `openwrt-25.12.2-mediatek-filogic-kmod-amneziawg`
- `openwrt-25.12.2-mediatek-filogic-amneziawg-tools`
- `openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg`

GitHub release publishes the same packages as individual assets:

- `openwrt-25.12.2-mediatek-filogic-kmod-amneziawg.apk`
- `openwrt-25.12.2-mediatek-filogic-amneziawg-tools.apk`
- `openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg.apk`

## Install On Router

On an OpenWrt 25.12 router with `apk`, download the three release assets and install them:

`luci-proto-amneziawg` is the LuCI UI/protocol package. Install it if you want the AmneziaWG interface to show up in the web UI.

```sh
curl -L -o /tmp/kmod-amneziawg.apk https://github.com/kaseat/awg-openwrt-builder/releases/download/<release-tag>/openwrt-25.12.2-mediatek-filogic-kmod-amneziawg.apk
curl -L -o /tmp/amneziawg-tools.apk https://github.com/kaseat/awg-openwrt-builder/releases/download/<release-tag>/openwrt-25.12.2-mediatek-filogic-amneziawg-tools.apk
curl -L -o /tmp/luci-proto-amneziawg.apk https://github.com/kaseat/awg-openwrt-builder/releases/download/<release-tag>/openwrt-25.12.2-mediatek-filogic-luci-proto-amneziawg.apk

apk add --allow-untrusted /tmp/kmod-amneziawg.apk /tmp/amneziawg-tools.apk /tmp/luci-proto-amneziawg.apk
```

Then reload networking:

```sh
/etc/init.d/network restart
```

If you only want the runtime protocol without LuCI, install `kmod-amneziawg.apk` and `amneziawg-tools.apk` only.

Replace `<release-tag>` with the tag you want to install, for example `v0.0.13-test` or the latest published release.

You can extend it later with LuCI or additional protocols without changing the upstream source layout.
