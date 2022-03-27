package scan

import (
	_ "embed"
	"errors"
	"github.com/gardc/go-ouitools"
	"net"
	errors2 "netctrl.io/monitor/errors"
)

var db *ouidb.OuiDb

//go:embed vendors.txt
var vendorlist string

func InitializeOuiDb() {
	db = ouidb.NewFromString(&vendorlist)
	if db == nil {
		errors2.HandleFatalError(errors.New("could not initialize OUI DB"))
		return
	}
}

func OuiLookupTarget(mac net.HardwareAddr, resultVendor chan string) {
	if db == nil {
		errors2.HandleFatalError(errors.New("OUI DB not initialized"))
		return
	}
	vendor, err := db.VendorLookup(mac.String())
	if err != nil {
		vendor = "unknown"
	}
	resultVendor <- vendor
}
