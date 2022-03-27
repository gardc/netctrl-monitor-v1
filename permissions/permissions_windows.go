package permissions

import (
	"errors"
)

func NeedsPermissions() bool {
	return false
}

func SetPermissions() error {
	return errors.New("tried to elevate app on Windows")
}
