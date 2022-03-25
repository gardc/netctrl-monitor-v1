package permissions

import "testing"

func TestGetAppLocation(t *testing.T) {
	loc, err := GetAppLocation()
	if err != nil || loc == "" {
		t.Fatal(err)
	}
	t.Logf("Binary location: %s", loc)
}
