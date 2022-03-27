package permissions

import (
	"log"
	"os/exec"
	"strings"
)

func NeedsPermissions() bool {
	loc, err := GetAppLocation()
	if err != nil {
		panic(err)
	}
	cmd := exec.Command("/usr/sbin/getcap", loc)
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	o := string(out)
	if strings.Contains(o, "= cap_net_admin,cap_net_raw+eip") || strings.Contains(o, " cap_net_admin,cap_net_raw=eip") {
		return false
	} else {
		return true
	}
}

func SetPermissions() bool {
	loc, err := GetAppLocation()
	if err != nil {
		panic(err)
	}
	cmd := exec.Command("/usr/bin/pkexec", "setcap", "cap_net_raw,cap_net_admin=eip", loc)
	out, err := cmd.Output()
	o := string(out)
	log.Println(o)
	if err != nil {
		return false
	}
	if o != "" {
		return false
	} else {
		return true
	}
}
