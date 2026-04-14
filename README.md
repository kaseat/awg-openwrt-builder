# awg-openwrt-builder

Minimal OpenWrt builder for AmneziaWG packages.

What this repo contains:

- GitHub Actions workflow.
- Thin OpenWrt package wrappers.
- Runtime glue for `amneziawg-tools` (`amneziawg.sh` and watchdog helper).

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

You can extend it later with LuCI or additional protocols without changing the upstream source layout.

