package scan

import (
	_ "embed"
	"github.com/gardc/go-ouitools"
	"net"
)

var db *ouidb.OuiDb

//go:embed vendors.txt
var vendorlist string

func InitializeOuiDb() {
	db = ouidb.NewFromString(&vendorlist)
	if db == nil {
		panic("can't load vendor db")
	}
}

func OuiLookupTarget(mac net.HardwareAddr, resultVendor chan string) {
	if db == nil {
		panic("vendor db not initialized")
	}
	vendor, err := db.VendorLookup(mac.String())
	if err != nil {
		vendor = "unknown"
	}
	resultVendor <- vendor
}
