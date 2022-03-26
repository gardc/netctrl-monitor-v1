package remote

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
)

func GetRemoteNSAPIURL() string {
	devMode := os.Getenv("devmode")
	suffix := "v1"
	if devMode == "local" {
		return "http://localhost:8090/" + suffix
	} else if devMode == "dev" {
		return "https://dev.netctrl.io/" + suffix
	} else {
		return "https://netctrl.io/" + suffix
	}
}

func GetIPs(ipNet net.IPNet, jwtToken string) ([]net.IP, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%v/ips?ip=%v", GetRemoteNSAPIURL(), ipNet.IP.To4()), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", jwtToken))
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode == 200 {
		// Unmarshal response
		type IPsResponse struct {
			IPs []net.IP `json:"ips"`
		}
		var ips IPsResponse
		err = json.Unmarshal(body, &ips)
		if err != nil {
			return nil, err
		}
		// Return IPs
		return ips.IPs, nil
	} else {
		if len(body) > 0 {
			// Unmarshal error response
			type Response struct {
				Message string `json:"message"`
			}
			var r Response
			err = json.Unmarshal(body, &r)
			if err != nil {
				return nil, err
			}
			// Return error message
			return nil, fmt.Errorf("error communicating with Monitor remote API, received status %v with message: %v", resp.StatusCode, r.Message)
		} else {
			return nil, fmt.Errorf("error communicating with Monitor remote API, received status %v", resp.StatusCode)
		}
	}
}

type ARPLayerRequest struct {
	SrcMAC    net.HardwareAddr `json:"sm"`
	SrcIP     net.IP           `json:"si"`
	DstMAC    net.HardwareAddr `json:"dm"`
	DstIP     net.IP           `json:"di"`
	ArpOpcode uint16           `json:"o"`
}

func CraftPacketRemotely(
	srcMAC net.HardwareAddr,
	srcIP net.IP,
	dstMAC net.HardwareAddr,
	dstIP net.IP,
	arpOpcode uint16,
	jwtToken string,
) ([]byte, error) {
	client := &http.Client{}
	reqData := ARPLayerRequest{
		SrcMAC:    []byte(srcMAC),
		SrcIP:     []byte(srcIP.To4()),
		DstMAC:    []byte(dstMAC),
		DstIP:     []byte(dstIP.To4()),
		ArpOpcode: arpOpcode,
	}
	marshalled, err := json.Marshal(reqData)
	if err != nil {
		return nil, err
	}
	reqBody := bytes.NewBuffer(marshalled)
	req, err := http.NewRequest("POST", fmt.Sprintf("%v/packet", GetRemoteNSAPIURL()), reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", jwtToken))
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode == 200 {
		// Unmarshal response
		type Response struct {
			Packet []byte `json:"packet"`
		}
		var r Response
		err = json.Unmarshal(body, &r)
		if err != nil {
			return nil, err
		}
		// Return ARP Layer
		return r.Packet, nil
	} else {
		if len(body) > 0 {
			// Unmarshal error response
			type Response struct {
				Message string `json:"message"`
			}
			var r Response
			err = json.Unmarshal(body, &r)
			if err != nil {
				return nil, err
			}
			// Return error message
			return nil, fmt.Errorf("error communicating with Monitor remote API, received status %v with message: %v", resp.StatusCode, r.Message)
		} else {
			return nil, fmt.Errorf("error communicating with Monitor remote API, received status %v", resp.StatusCode)
		}
	}
}
