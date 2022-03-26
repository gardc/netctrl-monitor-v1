package poison

import (
	"github.com/google/gopacket/pcap"
	"github.com/jackpal/gateway"
	"net"
	"netctrl.io/monitor/networking/network"
	"os"
	"os/signal"
	"testing"
	"time"
)

var targetIP = net.IPv4(192, 168, 1, 122)
var targetMAC, _ = net.ParseMAC("7e-2d-0d-e1-ab-88")

func TestPoison(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skip TestPoison in CI")
	}

	localIP, _ := network.GetLocalIP()
	iface, _ := network.GetLocalIfaceFromIP(localIP)

	// Open up a pcap handle for packet reads/writes.
	handle, err := pcap.OpenLive(iface.Name, 65536, true, pcap.BlockForever)
	if err != nil {
		t.Fatal(err)
	}
	defer handle.Close()

	stop := make(chan struct{})
	c := make(chan os.Signal)
	signal.Notify(c, os.Kill)

	//gatewayMAC, _ := net.ParseMAC("00-22-07-4a-21-d5")
	gatewayIP, _ := gateway.DiscoverGateway()
	gatewayMAC, _ := network.LookupArpTable(gatewayIP.String())
	sleepDuration := time.Second

	go Poison(handle, "", iface, targetIP, targetMAC, gatewayMAC, gatewayIP, sleepDuration, stop)

	select {
	case <-c:
		close(stop)
		return
	}
}

func TestResetPoison(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skip TestResetPoison in CI")
	}

	localIP, _ := network.GetLocalIP()
	iface, _ := network.GetLocalIfaceFromIP(localIP)
	t.Logf("Iface name: %v", iface.Name)

	// Open up a pcap handle for packet reads/writes.
	handle, err := pcap.OpenLive(iface.Name, 65536, true, pcap.BlockForever)
	if err != nil {
		t.Fatal(err)
	}
	defer handle.Close()

	c := make(chan os.Signal)
	signal.Notify(c, os.Kill)

	gatewayIP, _ := gateway.DiscoverGateway()
	gatewayMAC, _ := network.LookupArpTable(gatewayIP.String())

	for i := 0; i < 5; i++ {
		go ResetPoison(handle, targetIP, targetMAC, gatewayMAC, gatewayIP, "")
		t.Log("Sent reset packet")
		time.Sleep(time.Second)
	}
}
