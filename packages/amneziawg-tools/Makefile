include $(TOPDIR)/rules.mk

PKG_NAME:=amneziawg-tools
PKG_VERSION:=1.0.20260223
PKG_RELEASE:=2

PKG_SOURCE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/amnezia-vpn/amneziawg-tools/archive/refs/tags/
PKG_HASH:=ab09cfafe6c1e9a6260964a8ba5cb2d657cc23862eb0c29253305e532ac40a16

PKG_MAINTAINER:=Amnezia Admin <admin@amnezia.org>
PKG_LICENSE:=GPL-2.0
PKG_LICENSE_FILES:=COPYING

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

MAKE_PATH:=src
MAKE_VARS += PLATFORM=linux

define Package/amneziawg-tools
	CATEGORY:=Network
	URL:=https://github.com/amnezia-vpn/amneziawg-tools
	MAINTAINER:=Amnezia Admin <admin@amnezia.org>
	TITLE:=AmneziaWG userspace control program
	DEPENDS:= \
		+@BUSYBOX_CONFIG_IP \
		+@BUSYBOX_CONFIG_FEATURE_IP_LINK
endef

define Package/amneziawg-tools/description
	AmneziaWG userspace control program with OpenWrt netifd glue.
endef

define Package/amneziawg-tools/install
	$(INSTALL_DIR) $(1)/usr/bin/
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/src/wg $(1)/usr/bin/awg
	$(INSTALL_BIN) ./files/amneziawg_watchdog $(1)/usr/bin/
	$(INSTALL_DIR) $(1)/lib/netifd/proto/
	$(INSTALL_BIN) ./files/amneziawg.sh $(1)/lib/netifd/proto/
endef

$(eval $(call BuildPackage,amneziawg-tools))
