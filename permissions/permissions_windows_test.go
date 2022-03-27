package permissions_test

import (
	"netctrl.io/monitor/permissions"
	"testing"
)

func TestNeedsPermissions(t *testing.T) {
	n := permissions.NeedsPermissions()
	if n == true {
		t.Fail()
	}
}
