package network

import (
	"encoding/json"
	"log"
	"net"
	"reflect"
	"testing"
	"time"

	"github.com/jackpal/gateway"
)

func TestGetLocalIP(t *testing.T) {
	ip, err := GetLocalIP()
	if err != nil {
		t.Fatal(err)
	}
	if ip.String() == "" {
		t.Fail()
	}
	t.Logf("Local IP: %v", ip)
}

func TestGetLocalIfaceFromIP(t *testing.T) {
	ip, _ := GetLocalIP()
	iface, err := GetLocalIfaceFromIP(ip)
	if err != nil {
		t.Fatal(err)
	}
	if iface.HardwareAddr == nil || iface.Name == "" {
		t.Fatal()
	}
	t.Logf("Iface for IP %v is: %v", ip, iface)
}

func TestSearchArpTable(t *testing.T) {
	gatewayIP, _ := gateway.DiscoverGateway()
	gatewayMAC, err := LookupArpTable(gatewayIP.String())
	if err != nil {
		t.Fatal(err)
	}

	if gatewayMAC == nil {
		t.Fatal()
	}
	t.Logf("Gateway MAC: %v", gatewayMAC)
}

func TestFixMacOSMACNotation(t *testing.T) {
	testMac := "3:9:02:7f:ff:fa"
	fixed := FixMacOSMACNotation(testMac)
	if testMac == fixed {
		t.Fatal("testMac and fixed is same value")
	}
	if fixed != "03:09:02:7f:ff:fa" {
		t.Fatalf("fixed was not expected format, but was instead %v", testMac)
	}
	_, err := net.ParseMAC(fixed)
	if err != nil {
		t.Fatalf("err parsing mac: %v", err)
	}
	testMac = "0:22:7:4a:21:d5"
	fixed = FixMacOSMACNotation(testMac)
	if testMac == fixed {
		t.Fatal("testMac and fixed is same value")
	}
	if fixed != "00:22:07:4a:21:d5" {
		t.Fatalf("fixed was not expected format, but was instead %v", testMac)
	}
	_, err = net.ParseMAC(fixed)
	if err != nil {
		t.Fatalf("err parsing mac: %v", err)
	}
}

func TestTimeDuration(t *testing.T) {
	s := 10
	v := time.Second * time.Duration(s)
	t.Logf("%v", v)
}

//func TestGetRemoteIPs(t *testing.T) {
//	ip, _ := GetLocalIP()
//	localIPNet := net.IPNet{
//		IP:   ip,
//		Mask: net.CIDRMask(24, 32),
//	}
//	ips, err := GetIPs(localIPNet, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC50ZXN0IiwiaWF0IjoxNjM0NjYxMjEyfQ.2YN_zEnsOzamoX003pIO0hOBnw99Qv8TB_qiZhWDuFI")
//	if err != nil {
//		t.Fatal(err)
//	}
//	t.Logf("IPs received: %v", ips)
//}

func TestByteMarshall(t *testing.T) {
	x := []byte{255, 0, 0, 255, 0, 255, 208, 0}
	m, _ := json.Marshal(x)
	var y []byte
	_ = json.Unmarshal(m, &y)
	if !reflect.DeepEqual(x, y) {
		log.Printf("x: %v\n", x)
		log.Printf("y: %v\n", y)

		t.Fail()
	}
}
