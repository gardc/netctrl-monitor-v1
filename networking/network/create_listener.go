package network

import (
	"net"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

func CreateListener(
	handle *pcap.Handle,
	iface net.Interface,
	stop chan struct{},
	packets chan gopacket.Packet,
) {
	src := gopacket.NewPacketSource(handle, layers.LayerTypeEthernet)
	in := src.Packets()
	for {
		var packet gopacket.Packet
		select {
		case <-stop:
			return
		case packet = <-in:
			// Incoming packet
			packets <- packet
		}
	}
}
