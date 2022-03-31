package remote

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/Masterminds/semver"
	"io/ioutil"
	"net"
	"net/http"
)

var APIBaseURL = "https://netctrl.io"

// DoAuthenticatedGetRequest makes a GET request to the URL <base>/api/monitorClient/{uriSuffix}.
func DoAuthenticatedGetRequest(uriSuffix, jwt string) (*http.Response, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/%s", GetRemoteNSAPIURL(), uriSuffix), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", jwt))
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

// DoAuthenticatedPostRequest makes a POST request to the URL <base>/api/monitorClient/{uriSuffix}.
// bodyValue will be JSON encoded automatically.
func DoAuthenticatedPostRequest(uriSuffix, bodyValue interface{}, jwt string) (*http.Response, error) {
	client := &http.Client{}
	marshalled, err := json.Marshal(bodyValue)
	if err != nil {
		return nil, err
	}
	reqBody := bytes.NewBuffer(marshalled)
	req, err := http.NewRequest("POST", fmt.Sprintf("%s/%s", GetRemoteNSAPIURL(), uriSuffix), reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", jwt))
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

//func GetRemoteAIPBaseURL() string {
//	devMode := os.Getenv("devmode")
//	if devMode == "local" {
//		return "http://localhost:3000"
//	} else if devMode == "dev" {
//		return "https://dev.netctrl.io"
//	} else {
//		return "https://netctrl.io"
//	}
//}

func GetRemoteNSAPIURL() string {
	suffix := "/api/monitorClient"
	return APIBaseURL + suffix
}

func GetIPs(ipNet net.IPNet, jwtToken string) ([]net.IP, error) {
	resp, err := DoAuthenticatedGetRequest(fmt.Sprintf("scanIps/%s", ipNet.IP.To4().String()), jwtToken)
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
	reqData := ARPLayerRequest{
		SrcMAC:    srcMAC,
		SrcIP:     srcIP.To4(),
		DstMAC:    dstMAC,
		DstIP:     dstIP.To4(),
		ArpOpcode: arpOpcode,
	}
	resp, err := DoAuthenticatedPostRequest("createPacket", reqData, jwtToken)
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

func UpdateAvailable(v *semver.Version) (bool, error) {
	res, err := DoAuthenticatedGetRequest("latestVersion", "")
	if err != nil {
		return false, err
	}
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return false, err
	}
	if res.StatusCode != 200 {
		return false, err
	} else {
		type Data struct {
			Version string `json:"version"`
		}
		var data Data
		err = json.Unmarshal(body, &data)
		if err != nil {
			return false, err
		}
		latest, err := semver.NewVersion(data.Version)
		if err != nil {
			return false, err
		}
		c, _ := semver.NewConstraint(fmt.Sprintf("> %s", v.String()))
		if c.Check(latest) {
			return true, nil
		}
	}
	return false, nil
}
