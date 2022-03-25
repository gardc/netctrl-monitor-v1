package permissions

import (
	"os"
	"path/filepath"
)

func GetAppLocation() (string, error) {
	e, err := os.Executable()
	if err != nil {
		return "", err
	}
	return filepath.Dir(e), nil
}
