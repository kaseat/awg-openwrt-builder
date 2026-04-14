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

## Router profiles

These are the router tuples this repo is currently used for:

| Name | LAN IP | Device | OpenWrt | target/subtarget | pkgarch | sdk_variant |
|---|---|---|---|---|---|---|
| `home` | `18.18.1.1` | BananaPi BPI-R3 | `24.10.2` | `mediatek/filogic` | `aarch64_cortex-a53` | `gcc-13.3.0_musl` |
| `owrt-solntsevo` | `18.19.1.1` | Xiaomi Redmi Router AX6000 | `25.12.2` | `mediatek/filogic` | `aarch64_cortex-a53` | `gcc-14.3.0_musl` |

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

- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.ipk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.ipk`
- `openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.ipk`

GitHub release title uses the same build id:

- `25.12.2-mediatek-filogic-aarch64-cortex-a53`

## Install on router

This repo publishes OpenWrt package archives as `.ipk` files.

Download the release assets and install them:

```sh
TAG=<release-tag>

curl -L -o /tmp/kmod-amneziawg.ipk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-kmod-amneziawg.ipk
curl -L -o /tmp/amneziawg-tools.ipk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-amneziawg-tools.ipk
curl -L -o /tmp/luci-proto-amneziawg.ipk \
  https://github.com/kaseat/awg-openwrt-builder/releases/download/${TAG}/openwrt-25.12.2_mediatek_filogic_aarch64_cortex-a53-luci-proto-amneziawg.ipk

apk add --allow-untrusted \
  /tmp/kmod-amneziawg.ipk \
  /tmp/amneziawg-tools.ipk \
  /tmp/luci-proto-amneziawg.ipk

/etc/init.d/network restart
```

Replace `<release-tag>` with the tag you want to install, for example `25.12.2-mediatek-filogic-aarch64-cortex-a53` or the latest published release.

If you do not need the LuCI interface, install only:

```sh
apk add --allow-untrusted /tmp/kmod-amneziawg.ipk /tmp/amneziawg-tools.ipk
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

Example for BPI-R3 on OpenWrt 24.10.2:

- `openwrt_release = 24.10.2`
- `target = mediatek`
- `subtarget = filogic`
- `pkgarch = aarch64_cortex-a53`
- `sdk_variant = gcc-13.3.0_musl`

For kernel packages, `openwrt_release`, `target`, `subtarget`, `pkgarch`, and `sdk_variant` must match the router firmware family exactly. If they do not, the kmod build will not fit that router.

You can also trigger the same build by pushing a Git tag with the tuple name:

- `25.12.2-mediatek-filogic-aarch64-cortex-a53`
- `24.10.2-mediatek-filogic-aarch64-cortex-a53`

The workflow reads the tuple from the tag, derives the SDK variant automatically for the supported releases, and publishes a release with the same tuple name.

## Notes

- `luci-proto-amneziawg` is the LuCI protocol/UI package.
- `amneziawg-tools` installs `/lib/netifd/proto/amneziawg.sh` and the `awg` control binary.
- `kmod-amneziawg` is the kernel module that provides the actual tunnel device.
