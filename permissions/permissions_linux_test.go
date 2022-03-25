package permissions_test

func TestNeedsElevatedAccess(t *testing.T) {
	t.Logf("Needs elevated access: %s", NeedsElevatedAccess())
}
