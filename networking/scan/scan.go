package scan

import (
	"net"
	"netctrl.io/monitor/networking/network"
	"netctrl.io/monitor/networking/remote"
	"time"

	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type ArpScanResult struct {
	IPString  string           `json:"ipString"`
	MACString string           `json:"macString"`
	IP        net.IP           `json:"ip"`
	MAC       net.HardwareAddr `json:"mac"`
	Hostnames []string         `json:"hostnames"`
	Vendor    string           `json:"vendor"`
}

var broadcastMac = net.HardwareAddr{0xff, 0xff, 0xff, 0xff, 0xff, 0xff}

/*
 */

func ARPScan(
	handle *pcap.Handle,
	iface net.Interface,
	localIP net.IPNet,
	timeoutDuration time.Duration,
	jwtToken string, // Token used to authenticate with remote API
	results chan ArpScanResult, // Sends ARP scan result
	done chan interface{}, // Sends when ARPScan is done
	stop chan interface{}, // Receives stop command
) {
	arpReply := make(chan network.ReceivedArpReply)
	stopArpListener := make(chan struct{})
	timedOut := make(chan struct{})

	go network.ReadArpPackets(handle, iface, arpReply, stopArpListener)

	// Get IPs to scan from local IP
	ips, err := remote.GetIPs(localIP, jwtToken)
	if err != nil {
		panic(err)
		close(stopArpListener)
		done <- struct{}{}
		return
	}
	for _, ip := range ips {
		go network.CraftAndSendArpPacket(handle, iface.HardwareAddr, localIP.IP, broadcastMac, ip.To4(), layers.ARPRequest)
		// go func(ip net.IP) {
		// 	packet, err := network.CraftPacketRemotely(iface.HardwareAddr, localIP.IP.To4(), broadcastMac, ip.To4(), layers.ARPRequest, jwtToken)
		// 	if err != nil {
		// 		panic(err)
		// 	}
		// 	io.Out(fmt.Sprintf("%v", packet), "debug")
		// 	network.SendPacket(handle, packet)
		// }(ip)
	}

	// Timeout
	go func() {
		time.Sleep(timeoutDuration)
		close(timedOut)
	}()

	for {
		select {
		case <-stop:
			close(stopArpListener)
			done <- struct{}{}
			return
		case <-timedOut:
			close(stopArpListener)
			done <- struct{}{}
			return
		case reply := <-arpReply:
			go idTarget(reply, results)
		}
	}
}

func idTarget(reply network.ReceivedArpReply, results chan ArpScanResult) {
	// Lookup OUI concurrently
	vendorResult := make(chan string)
	go OuiLookupTarget(reply.MAC, vendorResult)

	hostnames, err := net.LookupAddr(reply.IP.String())
	if err != nil {
		hostnames = []string{"unknown"}
	}
	res := ArpScanResult{
		IP:        reply.IP.To4(),
		MAC:       reply.MAC,
		IPString:  reply.IP.To4().String(),
		MACString: reply.MAC.String(),
		Hostnames: hostnames,
		Vendor:    <-vendorResult,
	}
	results <- res
}
