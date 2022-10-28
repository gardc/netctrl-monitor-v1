package listen

import (
	"net"

	"github.com/google/gopacket"
	"github.com/google/gopacket/pcap"
	"netctrl.io/monitor/networking/identify"
	"netctrl.io/monitor/networking/network"
)

type ListenerSettings struct {
	FilterAll   bool
	FilterARP   bool
	FilterHTTPS bool
	filterHTTP  bool
	FilterPing  bool
}

func ListenForPackets(
	handle *pcap.Handle,
	iface net.Interface,
	stop chan struct{},
	identifiedDevices chan identify.IdentifiedDevice,
) {
	packets := make(chan gopacket.Packet)
	go network.CreateListener(handle, iface, stop, packets)

	var packet gopacket.Packet
	for {
		select {
		case <-stop:
			return
		case packet = <-packets:
			// Register ARP reply

			// Filter packet

		}
	}
}
