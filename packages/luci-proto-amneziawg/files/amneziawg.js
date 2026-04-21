"use strict";
"require form";
"require network";

function validateBase64(value) {
	if (!value) return true;
	if (
		value.length !== 44 ||
		!value.match(/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/)
	)
		return _("Invalid Base64 key string");
	if (value[43] !== "=")
		return _("Invalid Base64 key string");
	return true;
}

function safeTab(section, name, title) {
	try {
		section.tab(name, title);
	} catch (e) {}
}

return network.registerProtocol("amneziawg", {
	getI18n: function () {
		return _("AmneziaWG VPN");
	},

	getOpkgPackage: function () {
		return "luci-proto-amneziawg";
	},

	isFloating: function () {
		return true;
	},

	isVirtual: function () {
		return true;
	},

	getDevices: function () {
		return null;
	},

	containsDevice: function (ifname) {
		return network.getIfnameOf(ifname) == this.getIfname();
	},

	renderFormOptions: function (s) {
		var o, ss;

		safeTab(s, "general", _("General"));
		safeTab(s, "advanced", _("Advanced"));
		safeTab(s, "amneziawg", _("AmneziaWG"));
		safeTab(s, "peers", _("Peers"));

		o = s.taboption("general", form.Value, "private_key", _("Private Key"));
		o.password = true;
		o.rmempty = false;
		o.validate = function (sid, value) {
			return validateBase64(value);
		};

		o = s.taboption("general", form.DynamicList, "addresses", _("IP Addresses"));
		o.placeholder = "10.8.20.4/32";
		o.rmempty = true;

		o = s.taboption("general", form.Value, "listen_port", _("Listen Port"));
		o.datatype = "port";
		o.placeholder = "random";
		o.optional = true;

		o = s.taboption("general", form.Flag, "nohostroute", _("No Host Routes"));
		o.optional = true;

		o = s.taboption("advanced", form.Value, "mtu", _("MTU"));
		o.datatype = "range(0,8940)";
		o.placeholder = "1420";
		o.optional = true;

		o = s.taboption("advanced", form.Value, "fwmark", _("Firewall Mark"));
		o.optional = true;
		o.validate = function (sid, value) {
			if (value && !value.match(/^0x[a-fA-F0-9]{1,8}$/))
				return _("Invalid hexadecimal value");
			return true;
		};

		o = s.taboption("amneziawg", form.Value, "awg_jc", _("Jc"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_jmin", _("Jmin"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_jmax", _("Jmax"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_s1", _("S1"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_s2", _("S2"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_s3", _("S3"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_s4", _("S4"));
		o.datatype = "uinteger";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_h1", _("H1"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_h2", _("H2"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_h3", _("H3"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_h4", _("H4"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_i1", _("I1"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_i2", _("I2"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_i3", _("I3"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_i4", _("I4"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("amneziawg", form.Value, "awg_i5", _("I5"));
		o.datatype = "string";
		o.optional = true;

		o = s.taboption("peers", form.SectionValue, "_peers", form.GridSection, "amneziawg_%s".format(s.section));
		o.depends("proto", "amneziawg");

		ss = o.subsection;
		ss.anonymous = true;
		ss.addremove = true;
		ss.nodescriptions = true;

		o = ss.option(form.Flag, "disabled", _("Disable peer"));
		o.optional = true;

		o = ss.option(form.Value, "description", _("Description"));
		o.placeholder = "My Peer";
		o.optional = true;

		o = ss.option(form.Value, "public_key", _("Public Key"));
		o.password = false;
		o.validate = function (sid, value) {
			return validateBase64(value);
		};
		o.rmempty = false;

		o = ss.option(form.Value, "preshared_key", _("Preshared Key"));
		o.password = true;
		o.validate = function (sid, value) {
			return validateBase64(value);
		};
		o.optional = true;

		o = ss.option(form.DynamicList, "allowed_ips", _("Allowed IPs"));
		o.placeholder = "0.0.0.0/0";
		o.optional = true;

		o = ss.option(form.Value, "endpoint_host", _("Endpoint Host"));
		o.placeholder = "vpn.example.com";
		o.optional = true;

		o = ss.option(form.Value, "endpoint_port", _("Endpoint Port"));
		o.datatype = "port";
		o.placeholder = "51820";
		o.optional = true;

		o = ss.option(form.Value, "persistent_keepalive", _("Persistent Keepalive"));
		o.datatype = "uinteger";
		o.placeholder = "25";
		o.optional = true;

		o = ss.option(form.Flag, "route_allowed_ips", _("Route allowed IPs"));
		o.optional = true;

		o = ss.option(form.Flag, "advanced_security", _("Advanced Security"));
		o.optional = true;
	}
});
