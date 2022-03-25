package permissions

func NeedsPermissions() bool {
	loc, err = GetAppLocation()
	if err != nil {
		panic(err)
	}
	cmd := exec.Command("/usr/sbin/getcap", loc)
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	if strings.Contains(out, "= cap_net_admin,cap_net_raw+eip") || strings.Contains(out, " cap_net_admin,cap_net_raw=eip") {
		return false
	} else {
		return true
	}
}

func SetPermissions() bool {
	loc, err = GetAppLocation()
	if err != nil {
		panic(err)
	}
	cmd := exec.Command("/usr/bin/pkexec", "setcap", "cap_net_raw,cap_net_admin=eip", loc)
	out, err := cmd.Output()
	if err != nil {
		return false
	}
	if out != "" {
		return false
	} else {
		return true
	}
}
