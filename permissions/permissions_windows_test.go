package permissions_test

import (
	"changeme/permissions"
)

func TestNeedsPermissions() {
	n := permissions.NeedsPermissions()
	if n == true {
		t.Fail()
	}
}
