package permissions_test

import (
	"testing"
)

func TestSetPermissions(t *testing.T) {
	t.Logf("Set permissions : %v", SetPermissions())
}

func TestNeedsPermissions(t *testing.T) {
	t.Logf("Needs elevated access: %v", NeedsPermissions())
}
