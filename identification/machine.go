package identification

import (
	"fmt"
	"log"
	"os"
	"runtime"

	"github.com/denisbrodbeck/machineid"
)

func GetOS() string {
	goos := runtime.GOOS
	switch goos {
	case "windows":
		return "Windows"
	case "darwin":
		return "Mac"
	case "linux":
		return "Linux"
	default:
		return fmt.Sprintf("Unknown: %s", goos)
	}
}

func GetMachineID() string {
	id, err := machineid.ID()
	if err != nil {
		log.Fatal(err)
	}
	return id
}

func GetMachineHostname() string {
	name, err := os.Hostname()
	if err != nil {
		log.Fatal(err)
	}
	return name
}
