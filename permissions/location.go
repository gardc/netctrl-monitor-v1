package permissions

import (
	"os"
)

func GetAppLocation() string {
	// e, err := os.Executable()
	// if err != nil {
	// 	return "", err
	// }
	// return path.Dir(e), nil
	return os.Args[0]
}
