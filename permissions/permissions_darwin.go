package permissions

import (
	"log"
	"os/exec"
	"strings"
)

func NeedsPermissions() bool {
	cmd := exec.Command("sh", "-c", "stat -f '%A' /dev/bpf*")
	out, err := cmd.Output()
	//log.Printf("NeedsPerms out: %s\n", out)
	if err != nil {
		errors.HandleFatalError(err)
		return
	}
	o := string(out)

	outSplit := strings.Split(o, "\n")
	for _, l := range outSplit {
		// If line is empty or isn't 777
		if l != "" && !strings.Contains(l, "777") {
			return true
		}
	}
	return false
}

// SetPermissions returns true if settings permissions was successful.
func SetPermissions() bool {
	cmd := exec.Command("sh", "-c", "osascript -e \"do shell script \\\"chmod 777 /dev/bpf*\\\" with administrator privileges\"")
	out, err := cmd.Output()
	if err != nil {
		log.Printf("Error on setperms: %v. Out: %v", err, string(out))
		return false
	}
	o := string(out)
	//log.Printf("cmd out: %s", o)
	if strings.Contains(o, "User cancelled.") {
		return false
	} else {
		return !NeedsPermissions()
	}
}
