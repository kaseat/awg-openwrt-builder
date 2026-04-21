include $(TOPDIR)/rules.mk

PKG_NAME:=luci-proto-amneziawg
PKG_VERSION:=1
PKG_RELEASE:=2

PKG_MAINTAINER:=Amnezia Admin <admin@amnezia.org>
PKG_LICENSE:=Apache-2.0

include $(INCLUDE_DIR)/package.mk

define Package/luci-proto-amneziawg
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Protocols
  TITLE:=LuCI support for AmneziaWG
  DEPENDS:=+luci-base +amneziawg-tools
  PKGARCH:=all
endef

define Package/luci-proto-amneziawg/description
  LuCI protocol support for AmneziaWG interfaces and peers.
endef

define Build/Compile
	true
endef

define Package/luci-proto-amneziawg/install
	$(INSTALL_DIR) $(1)/www/luci-static/resources/protocol
	$(INSTALL_DATA) ./files/amneziawg.js $(1)/www/luci-static/resources/protocol/amneziawg.js
endef

$(eval $(call BuildPackage,luci-proto-amneziawg))
