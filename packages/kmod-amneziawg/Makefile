include $(TOPDIR)/rules.mk

include $(INCLUDE_DIR)/kernel.mk

PKG_NAME:=kmod-amneziawg
PKG_VERSION:=3.1.20260906
PKG_RELEASE:=1
PKG_SOURCE_SUBDIR:=amneziawg-linux-kernel-module-$(PKG_VERSION)
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_SUBDIR)

PKG_SOURCE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/amnezia-vpn/amneziawg-linux-kernel-module/archive/refs/tags/
PKG_HASH:=e32fa46f1b6f9e319c5261f0b0765c3a9261e40cb7c4616fd73500da961a2932

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
		WIREGUARD_VERSION="$(PKG_VERSION)" \
		modules
endef

$(eval $(call KernelPackage,amneziawg))
