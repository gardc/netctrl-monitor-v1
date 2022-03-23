package identification_test

import (
	"changeme/identification"
	"testing"
)

func TestGetOS(t *testing.T) {
	getos := identification.GetOS()
	t.Logf("GetOS = %s\n", getos)

	if getos == "" {
		t.Fail()
	}
}

func TestGetMachineID(t *testing.T) {
	mid := identification.GetMachineID()
	t.Logf("GetMachineID = %s\n", mid)

	if mid == "" {
		t.Fail()
	}
}

func TestGetMachineHostname(t *testing.T) {
	h := identification.GetMachineHostname()
	t.Logf("GetMachineHostname = %s\n", h)

	if h == "" {
		t.Fail()
	}
}
