package network

import (
	"bytes"
	"log"
	"net"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type ReceivedArpReply struct {
	IP  net.IP
	MAC net.HardwareAddr
}

func CraftAndSendArpPacket(
	handle *pcap.Handle,
	srcMAC net.HardwareAddr,
	srcIP net.IP,
	dstMAC net.HardwareAddr,
	dstIP net.IP,
	arpOpcode uint16,
) {
	eth := layers.Ethernet{
		SrcMAC:       srcMAC,
		DstMAC:       dstMAC,
		EthernetType: layers.EthernetTypeARP,
	}
	arp := layers.ARP{
		AddrType:          layers.LinkTypeEthernet,
		Protocol:          layers.EthernetTypeIPv4,
		HwAddressSize:     6,
		ProtAddressSize:   4,
		Operation:         arpOpcode,
		SourceHwAddress:   []byte(srcMAC),
		SourceProtAddress: []byte(srcIP.To4()),
		DstHwAddress:      []byte(dstMAC),
		DstProtAddress:    []byte(dstIP.To4()),
	}
	opts := gopacket.SerializeOptions{
		FixLengths:       true,
		ComputeChecksums: true,
	}
	buf := gopacket.NewSerializeBuffer()

	gopacket.SerializeLayers(buf, opts, &eth, &arp)
	if err := handle.WritePacketData(buf.Bytes()); err != nil {
		log.Fatal(err)
	}
}

// Send a packet that has been created (remotely, probably)
func SendPacket(
	handle *pcap.Handle,
	p []byte,
) {
	if err := handle.WritePacketData(p); err != nil {
		log.Fatal(err)
	}
}

// ReadArpPackets watches a handle for incoming ARP responses we might care about.
// Will loop until 'stop' is closed.
func ReadArpPackets(
	handle *pcap.Handle,
	iface net.Interface,
	results chan ReceivedArpReply,
	stop chan struct{},
) {
	src := gopacket.NewPacketSource(handle, layers.LayerTypeEthernet)
	in := src.Packets()
	for {
		var packet gopacket.Packet
		select {
		case <-stop:
			return
		case packet = <-in:
			arpLayer := packet.Layer(layers.LayerTypeARP)
			if arpLayer == nil {
				continue
			}
			arp := arpLayer.(*layers.ARP)
			if arp.Operation != layers.ARPReply || bytes.Equal([]byte(iface.HardwareAddr), arp.SourceHwAddress) {
				// I sent this packet
				continue
			}
			// Note:  we might get some packets here that aren't responses to ones we've sent,
			// if for example someone else sends US an ARP request.  Doesn't much matter, though...
			// all information is good information :)
			ip := net.IP(arp.SourceProtAddress)
			mac := net.HardwareAddr(arp.SourceHwAddress)
			results <- ReceivedArpReply{
				IP:  ip,
				MAC: mac,
			}
		}
	}
}
