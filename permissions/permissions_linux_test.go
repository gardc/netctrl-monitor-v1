package permissions_test

import (
	"netctrl.io/monitor/permissions"
	"testing"
)

func TestSetPermissions(t *testing.T) {
	t.Logf("Set permissions : %v", permissions.SetPermissions())
}

func TestNeedsPermissions(t *testing.T) {
	t.Logf("Needs elevated access: %v", permissions.NeedsPermissions())
}

