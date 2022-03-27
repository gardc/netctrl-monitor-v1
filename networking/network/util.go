package network

import (
	"encoding/binary"
	"errors"
	"fmt"
	"net"
	errors2 "netctrl.io/monitor/errors"
	"runtime"
	"strings"

	"github.com/google/gopacket/pcap"
	"github.com/mostlygeek/arp"
)

// IPs is a simple and not very good method for getting all IPv4 addresses from a
// net.IPNet.  It returns all TargetIPs it can over the channel it sends back, closing
// the channel when done.
// Deprecated: Use GetIPs instead, which fetches from remote Monitor API.
func IPs(n *net.IPNet) (out []net.IP) {
	num := binary.BigEndian.Uint32(n.IP)
	mask := binary.BigEndian.Uint32(n.Mask)
	num &= mask
	for mask < 0xffffffff {
		var buf [4]byte
		binary.BigEndian.PutUint32(buf[:], num)
		out = append(out, net.IP(buf[:]))
		mask++
		num++
	}
	return
}

func GetLocalIP() (net.IP, error) {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return nil, err
	}
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	err = conn.Close()
	if err != nil {
		return nil, err
	}

	return localAddr.IP, nil
}

// LookupArpTable searches for an ARP
func LookupArpTable(s string) (net.HardwareAddr, error) {
	res := arp.Search(s)
	if res == "" {
		return nil, errors.New("IP not found")
	}
	// Fix notation on Unix
	if runtime.GOOS != "windows" {
		res = FixMacOSMACNotation(res)
	}
	mac, err := net.ParseMAC(res)
	if err != nil {
		return nil, err
	}
	return mac, nil
}

// FixMacOSMACNotation fixes the notation of MAC address on macOS.
// For instance: 1:0:5e:7f:ff:fa becomes 01:00:5e:7f:ff:fa.
// Improved version of mine https://stackoverflow.com/a/69193018/11791967
func FixMacOSMACNotation(s string) string {
	var e int
	var sb strings.Builder
	for i := 0; i < len(s); i++ {
		r := s[i]
		if r == ':' {
			for j := e; j < 2; j++ {
				sb.WriteString("0")
			}
			sb.WriteString(s[i-e : i])
			sb.WriteString(":")
			e = 0
			continue
		}
		e++
	}
	for j := e; j < 2; j++ {
		sb.WriteString("0")
	}
	sb.WriteString(s[len(s)-e:])
	return sb.String()
}

func GetLocalIfaceFromIP(ip net.IP) (net.Interface, error) {
	ifaces, err := net.Interfaces()
	if err != nil {
		return net.Interface{}, err
	}

	var localIface net.Interface

	// Range through ifaces and find the iface with matching IP
	for _, iface := range ifaces {
		// Get addrs
		addrs, err := iface.Addrs()
		if err != nil {
			return net.Interface{}, err
		}
		for _, a := range addrs {
			if ipnet, ok := a.(*net.IPNet); ok {
				if ipv4 := ipnet.IP.To4(); ipv4 != nil {
					if ipv4.Equal(ip) {
						localIface = iface
						goto found
					}
				}
			}
		}
	}

found:
	// If windows, update interface name
	if runtime.GOOS == "windows" {
		devices, err := pcap.FindAllDevs()
		if err != nil {
			errors2.HandleFatalError(err)
		}
		for _, device := range devices {
			for _, addr := range device.Addresses {
				if addr.IP.Equal(ip) {
					localIface.Name = device.Name
					goto ret
				}
			}
		}
	}

ret:
	// Check if found iface
	if localIface.HardwareAddr == nil {
		return localIface, errors.New(fmt.Sprintf("could not find iface for IP: %v", ip.String()))
	}

	return localIface, nil
}
