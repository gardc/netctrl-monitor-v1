package scan

import (
	"github.com/google/gopacket/pcap"
	"net"
	"netctrl.io/monitor/networking/network"
	"os"
	"testing"
	"time"
)

func TestArpScan(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skip ARP Scan in CI")
	}

	start := time.Now()
	InitializeOuiDb()
	t.Logf("Time to initialize db: %v\n", time.Since(start))

	localIP, _ := network.GetLocalIP()
	iface, _ := network.GetLocalIfaceFromIP(localIP)

	// Open up a pcap handle for packet reads/writes.
	handle, err := pcap.OpenLive(iface.Name, 65536, true, pcap.BlockForever)
	if err != nil {
		t.Fatal(err)
	}
	defer handle.Close()

	stop := make(chan interface{})
	done := make(chan interface{})
	results := make(chan ArpScanResult)
	timeout := time.Duration(time.Second * 8)

	localIPNet := net.IPNet{
		IP:   localIP,
		Mask: net.CIDRMask(24, 32),
	}

	go ARPScan(handle, iface, localIPNet, timeout, "", results, done, stop)

	// Quit after 15 seconds
	timesUp := make(chan struct{})
	go func() {
		time.Sleep(time.Second * 10)
		close(timesUp)
	}()

	for {
		select {
		case result := <-results:
			t.Logf("Received scan result: %v\n", result)
		case <-timesUp:
			close(stop)
			return
		}
	}
}
