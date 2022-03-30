package permissions

import (
	"log"
	"os/exec"
	"strings"

	"netctrl.io/monitor/errors"
)

func NeedsPermissions() bool {
	loc := GetAppLocation()
	log.Printf("loc: %v", loc)
	cmd := exec.Command("/usr/sbin/getcap", loc)
	out, err := cmd.Output()
	if err != nil {
		errors.HandleFatalError(err)
		return false
	}
	o := string(out)
	log.Printf("needs perms out: %s", o)
	if strings.Contains(o, "= cap_net_admin,cap_net_raw+eip") || strings.Contains(o, " cap_net_admin,cap_net_raw=eip") {
		return false
	} else {
		return true
	}
}

func SetPermissions() bool {
	loc := GetAppLocation()
	cmd := exec.Command("/usr/bin/pkexec", "setcap", "cap_net_raw,cap_net_admin=eip", loc)
	out, err := cmd.Output()
	o := string(out)
	log.Printf("SetPermissions cmd out: %s", o)
	if err != nil {
		return false
	}

	return !NeedsPermissions()
}
