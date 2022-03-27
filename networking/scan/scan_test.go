package scan

import (
	"net"
	"os"
	"os/exec"
	"runtime"
	"testing"
	"time"

	"github.com/google/gopacket/pcap"
	"netctrl.io/monitor/networking/network"
)

func TestArpScan(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skip ARP Scan in CI")
	}
	if runtime.GOOS == "linux" {
		os.Setenv("devmode", "dev")
		cmd := exec.Command("/usr/bin/pkexec", "setcap", "cap_net_raw,cap_net_admin=eip", os.Args[0])
		o, err := cmd.Output()
		t.Logf("arg0: %s\nsetcap out: %s\nsetcap err: %v\n", os.Args[0], o, err)
		// e, err := os.Executable()
		// t.Logf("executable: %v, err: %v\n", e, err)
		time.Sleep(500)
	}

	start := time.Now()
	InitializeOuiDb()
	t.Logf("Time to initialize db: %v\n", time.Since(start))

	localIP, _ := network.GetLocalIP()
	iface, _ := network.GetLocalIfaceFromIP(localIP)
	t.Logf("ip: %v, iface: %v\n", localIP, iface)

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

	jwt := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5ldGN0cmwuaW8iLCJwcm9Vc2VyIjp0cnVlLCJpYXQiOjE2NDgzOTk3MDl9.Xufgc6HOdahG81_6vUlSHfu2LpT7gH7bUFHwa1wq6s8"
	go ARPScan(handle, iface, localIPNet, timeout, jwt, results, done, stop)

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
