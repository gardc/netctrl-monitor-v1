package remote

import (
	"os"
	"testing"
)

func TestGetRemoteNSAPIURL(t *testing.T) {
	err := os.Setenv("devmode", "local")
	if err != nil {
		t.Fatal(err)
	}
	r := GetRemoteNSAPIURL()
	if r != "http://localhost:8090/v1" {
		t.Fatal("failed on devmode local")
	}
	err = os.Setenv("devmode", "dev")
	if err != nil {
		t.Fatal(err)
	}
	r = GetRemoteNSAPIURL()
	if r != "https://dev.netctrl.io/v1" {
		t.Fatal("failed on devmode dev")
	}
	err = os.Setenv("devmode", "prod")
	if err != nil {
		t.Fatal(err)
	}
	r = GetRemoteNSAPIURL()
	if r != "https://netctrl.io/v2" {
		t.Fatal("failed on devmode prod")
	}
}
