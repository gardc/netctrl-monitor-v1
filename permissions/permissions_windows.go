package permissions

import (
	"errors"
)

func NeedsPermissions() bool {
	return false
}

func SetPermissions() error {
	return errors.New("Tried to elevate app on Windows.")
}
