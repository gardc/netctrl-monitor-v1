package remote

import (
	"encoding/json"
	"fmt"
	"github.com/Masterminds/semver"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"testing"
)

func TestGetRemoteNSAPIURL(t *testing.T) {
	err := os.Setenv("devmode", "local")
	if err != nil {
		t.Fatal(err)
	}
	r := GetRemoteNSAPIURL()
	if r != "http://localhost:8090/v1" {
		t.Fatal("failed on devmode local")
	}
	err = os.Setenv("devmode", "dev")
	if err != nil {
		t.Fatal(err)
	}
	r = GetRemoteNSAPIURL()
	if r != "https://dev.netctrl.io/v1" {
		t.Fatal("failed on devmode dev")
	}
	err = os.Setenv("devmode", "prod")
	if err != nil {
		t.Fatal(err)
	}
	r = GetRemoteNSAPIURL()
	if r != "https://netctrl.io/v2" {
		t.Fatal("failed on devmode prod")
	}
}

func TestGetIPs(t *testing.T) {
	_ = os.Setenv("devmode", "local")
	localIpNet := net.IPNet{
		IP:   net.ParseIP("192.168.1.1"),
		Mask: net.CIDRMask(24, 32),
	}
	jwtToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC50ZXN0IiwicHJvVXNlciI6dHJ1ZSwiaWF0IjoxNjQ4MzIyODY1fQ.kTQcJBBpc-AuVNM-rUf8PoBwsJMQu7bR3h1g8A1zNsg"
	url := GetRemoteNSAPIURL()
	ipParam := localIpNet.IP.To4().String()
	builtUrl := fmt.Sprintf("%s/scanIps/%s", url, ipParam)
	t.Logf("JWT: %s", jwtToken)
	t.Logf("URL: %s", url)
	t.Logf("ipParam: %s", ipParam)
	t.Logf("builtUrl: %s", builtUrl)

	client := &http.Client{}
	req, err := http.NewRequest("GET", builtUrl, nil)
	if err != nil {
		t.Fatal(err)
	}
	bearer := fmt.Sprintf("Bearer %s", jwtToken)
	req.Header.Set("Authorization", bearer)
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode == 200 {
		// Unmarshal response
		type IPsResponse struct {
			IPs []net.IP `json:"ips"`
		}
		var ips IPsResponse
		err = json.Unmarshal(body, &ips)
		if err != nil {
			t.Fatal(err)
		}
		// Return IPs
		t.Logf("IPs: %v", ips)
	} else {
		if len(body) > 0 {
			// Unmarshal error response
			type Response struct {
				Message string `json:"message"`
			}
			var r Response
			err = json.Unmarshal(body, &r)
			if err != nil {
				t.Fatal(err)
			}
			// Return error message
			t.Fatalf("error status: %v, message: %v", resp.StatusCode, r.Message)
		} else {
			t.Fatalf("error status: %v", resp.StatusCode)
		}
	}
}

func TestCheckForUpdate(t *testing.T) {
	a, _ := semver.NewVersion("0.1.0")
	b, _ := semver.NewVersion("0.1.12")
	c, _ := semver.NewVersion("0.2.0")
	d, _ := semver.NewVersion("1.0.0")

	// Check with current version on server (0.2.0 atm)
	r, err := CheckForUpdate(a)
	if err != nil {
		t.Fatal(err)
	}
	if r == false {
		t.Failed()
	}
	r, err = CheckForUpdate(b)
	if err != nil {
		t.Fatal(err)
	}
	if r == false {
		t.Failed()
	}
	r, err = CheckForUpdate(c)
	if err != nil {
		t.Fatal(err)
	}
	if r == false {
		t.Failed()
	}
	r, err = CheckForUpdate(d)
	if err != nil {
		t.Fatal(err)
	}
	if r == true {
		t.Failed()
	}
}
