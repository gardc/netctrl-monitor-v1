package permissions

func NeedsPermissions() bool {
	cmd := exec.Command("sh", "-c", "stat -f '%A' /dev/bpf*")
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	if out != "" {
		return true
	} else {
		return false
	}
}

// Returns true if settings permissions was successful.
func SetPermissions() bool {
	loc, err = GetAppLocation()
	if err != nil {
		panic(err)
	}
	cmd := exec.Command("sh", "-c", "osascript -e \"do shell script \\\"chmod 777 /dev/bpf*\\\" with administrator privileges\"")
	out, err := cmd.Output()
	if err != nil {
		return false
	}
	if strings.Contains("User cancelled.") {
		return false
	} else {
		return !NeedsPermissions()
	}
}
