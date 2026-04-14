include $(TOPDIR)/rules.mk

include $(INCLUDE_DIR)/kernel.mk

PKG_NAME:=kmod-amneziawg
PKG_VERSION:=1.0.20260329.2
PKG_RELEASE:=1
AWG_SOURCE_VERSION:=1.0.20260329-2
PKG_SOURCE_SUBDIR:=amneziawg-linux-kernel-module-$(AWG_SOURCE_VERSION)
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_SUBDIR)

PKG_SOURCE:=v$(AWG_SOURCE_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/amnezia-vpn/amneziawg-linux-kernel-module/archive/refs/tags/
PKG_HASH:=db833b4bd2a464a43248f4603186b3d0d58c781ba49989a5b515451dcd3d8833

include $(INCLUDE_DIR)/package.mk

define KernelPackage/amneziawg
	SECTION:=kernel
	CATEGORY:=Kernel Modules
	SUBMENU:=Network Support
	TITLE:=AmneziaWG Kernel Module
	URL:=https://github.com/amnezia-vpn/amneziawg-linux-kernel-module
	MAINTAINER:=Amnezia Admin <admin@amnezia.org>
	FILES:=$(PKG_BUILD_DIR)/src/amneziawg.ko
	DEPENDS:= \
		+kmod-udptunnel4 \
		+kmod-udptunnel6 \
		+kmod-crypto-lib-chacha20 \
		+kmod-crypto-lib-chacha20poly1305 \
		+kmod-crypto-chacha20poly1305 \
		+kmod-crypto-lib-curve25519
endef

define Build/Compile
	$(MAKE) -C "$(LINUX_DIR)" \
		$(KERNEL_MAKE_FLAGS) \
		M="$(PKG_BUILD_DIR)/src" \
		WIREGUARD_VERSION="1.0.0" \
		modules
endef

$(eval $(call KernelPackage,amneziawg))
