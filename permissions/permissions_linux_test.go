package permissions_test

import (
	"netctrl.io/monitor/permissions"
	"testing"
)

func TestNeedsElevatedAccess(t *testing.T) {
	t.Logf("Needs elevated access: %v", permissions.NeedsPermissions())
}
