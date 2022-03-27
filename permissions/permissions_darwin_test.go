package permissions

import (
	"os/exec"
	"testing"
)

func TestSetPermissions(t *testing.T) {
	t.Logf("Needs elevated access before set perms: %v", NeedsPermissions())
	t.Logf("Set permissions : %v", SetPermissions())
	t.Logf("Needs elevated access after after perms: %v", NeedsPermissions())
}

func TestNeedsPermissions(t *testing.T) {
	t.Logf("Needs elevated access: %v", NeedsPermissions())
}

func TestStderr(t *testing.T) {
	cmd := exec.Command("sh", "-c", "osascript -e \"do shell script \\\"chmod 666 /dev/bpf*\\\" with administrator privileges\"")
	o, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("combined output: %s", o)
}
