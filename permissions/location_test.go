package permissions

import (
	"os"
	"testing"
)

func TestGetAppLocation(t *testing.T) {
	l := os.Args[0]
	//loc, err := GetAppLocation()
	// if err != nil || loc == "" {
	// 	t.Fatal(err)
	// }
	t.Logf("Binary location: %v", l)
}
