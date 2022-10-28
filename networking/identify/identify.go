package identify

import (
	"net"

	"netctrl.io/monitor/networking/network"
)

type IdentifiedDevice struct {
	IPString  string           `json:"ipString"`
	MACString string           `json:"macString"`
	IP        net.IP           `json:"ip"`
	MAC       net.HardwareAddr `json:"mac"`
	Hostnames []string         `json:"hostnames"`
	Vendor    string           `json:"vendor"`
}

func LookupDevice(reply network.ReceivedArpReply, results chan IdentifiedDevice) {
	// Lookup OUI concurrently
	vendorResult := make(chan string)
	go OuiLookupTarget(reply.MAC, vendorResult)

	hostnames, err := net.LookupAddr(reply.IP.String())
	if err != nil {
		hostnames = []string{"unknown"}
	}
	res := IdentifiedDevice{
		IP:        reply.IP.To4(),
		MAC:       reply.MAC,
		IPString:  reply.IP.To4().String(),
		MACString: reply.MAC.String(),
		Hostnames: hostnames,
		Vendor:    <-vendorResult,
	}
	results <- res
}
