package main

import (
	"context"
	"fmt"
	"github.com/Masterminds/semver"
	"github.com/google/gopacket/pcap"
	"github.com/jackpal/gateway"
	"github.com/pkg/browser"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"net"
	"netctrl.io/monitor/communication"
	"netctrl.io/monitor/identification"
	"netctrl.io/monitor/networking/network"
	"netctrl.io/monitor/networking/poison"
	"netctrl.io/monitor/networking/remote"
	"netctrl.io/monitor/networking/scan"
	"netctrl.io/monitor/permissions"
	"os"
	"time"
)

var Version, _ = semver.NewVersion("0.2.0")

// App struct
type App struct {
	ctx              context.Context
	JWT              string
	pcapHandle       *pcap.Handle
	stopScanHandle   chan interface{}
	stopPoisonHandle chan interface{}
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (b *App) startup(ctx context.Context) {
	// Perform your setup here
	b.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (b *App) domReady(ctx context.Context) {
	// Add your action here
	b.UpdateCheck()
}

// shutdown is called at application termination
func (b *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (b *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (b *App) SetJWT(JWT string) {
	runtime.LogInfo(b.ctx, fmt.Sprintf("Called SetJWT() from frontend with jwt: %s", JWT))
	b.JWT = JWT
}

func (b *App) GetVersion() string {
	return Version.String()
}

func (b *App) Quit() {
	os.Exit(0)
}

func (b *App) UpdateCheck() {
	u, err := remote.UpdateAvailable(Version)
	if err != nil {
		runtime.LogError(b.ctx, fmt.Sprintf("Error checking for update: %v", err))
		return
	}
	if !u {
		return
	}
	selected, err := runtime.MessageDialog(b.ctx, runtime.MessageDialogOptions{
		Type:          runtime.QuestionDialog,
		Title:         "An update is available",
		Message:       "Do you want to download the newest NetCTRL Monitor update?",
		Buttons:       []string{"Yes", "No"},
		DefaultButton: "Yes",
		CancelButton:  "No",
		Icon:          nil,
	})
	if err != nil {
		runtime.LogError(b.ctx, fmt.Sprintf("Error creating update modal: %v", err))
	}
	if selected == "Yes" {
		_ = browser.OpenURL(remote.GetRemoteAIPBaseURL() + "/user/download")
	}
}

func (b *App) NeedsPermissions() bool {
	return permissions.NeedsPermissions()
}

func (b *App) SetPermissions() bool {
	return permissions.SetPermissions()
}

/// Machine identification:

func (b *App) GetOS() string {
	return identification.GetOS()
}

func (b *App) GetMachineID() string {
	return identification.GetMachineID()
}

func (b *App) GetMachineHostname() string {
	return identification.GetMachineHostname()
}

/// Networking:

func (b *App) Initialize(iface net.Interface) {
	runtime.LogInfo(b.ctx, "Called InitializePcap() from frontend")
	h, err := pcap.OpenLive(iface.Name, 65536, true, pcap.BlockForever)
	if err != nil {
		runtime.LogError(b.ctx, err.Error())
	}
	b.pcapHandle = h
	scan.InitializeOuiDb()
	runtime.EventsEmit(b.ctx, communication.EmitTypeInitialized)
}

func (b *App) GetDefaultLocalIP() net.IP {
	runtime.LogInfo(b.ctx, "Called GetDefaultLocalIP() from frontend")
	ip, err := network.GetLocalIP()
	if err != nil {
		runtime.LogError(b.ctx, err.Error())
	}
	return ip.To4() // Ensure it's IPv4
}

func (b *App) GetIfaceFromIP(ip net.IP) net.Interface {
	runtime.LogInfo(b.ctx, "Called GetIfaceFromIP() from frontend")
	iface, err := network.GetLocalIfaceFromIP(ip)
	if err != nil {
		runtime.LogError(b.ctx, err.Error())
	}
	return iface
}

func (b *App) GetIPNetFromIP(ip net.IP) net.IPNet {
	runtime.LogInfo(b.ctx, "Called GetIPNetFromIP() from frontend")
	return net.IPNet{
		IP:   ip,
		Mask: net.CIDRMask(24, 32),
	}
}

func (b *App) GetGatewayIP() net.IP {
	runtime.LogInfo(b.ctx, "Called GetGatewayIP() from frontend")
	gatewayIP, err := gateway.DiscoverGateway()
	if err != nil {
		runtime.LogError(b.ctx, err.Error())
	}
	return gatewayIP
}

type MACInfo struct {
	Bytes  net.HardwareAddr `json:"bytes"`
	String string           `json:"string"`
}

func (b *App) LookupARPTable(ip net.IP) MACInfo {
	runtime.LogInfo(b.ctx, "Called LookupARPTable() from frontend")
	mac, err := network.LookupArpTable(ip.String())
	if err != nil {
		runtime.LogError(b.ctx, err.Error())
	}
	return MACInfo{
		Bytes:  mac,
		String: mac.String(),
	}
}

func (b *App) GetMACFromString(s string) net.HardwareAddr {
	m, err := net.ParseMAC(s)
	if err != nil {
		runtime.LogError(b.ctx, fmt.Sprintf("Could not parse MAC: %s", s))
	}
	return m
}

// StartListening starts listening to the network to get information about other hosts on the network.
func (b *App) StartListening() {
	// TODO: implement
}

// Scan starts a simple network scan on the selected interface, with a duration of scanTimeoutSeconds in seconds.
// It's preferred to implement new functionality that constantly listens to the network, where Scan() only
// sends out ARP request packets.
func (b *App) Scan(localIface net.Interface, localIPNet net.IPNet, scanTimeoutSeconds int) {
	runtime.LogInfo(b.ctx, fmt.Sprintf("Called Scan() from frontend with params: %v, %v, %v", localIface, localIPNet, scanTimeoutSeconds))
	b.stopScanHandle = make(chan interface{})
	results := make(chan scan.ArpScanResult)
	scanDone := make(chan interface{})

	// Start scanning
	timeoutDur := time.Second * time.Duration(scanTimeoutSeconds)
	runtime.LogInfo(b.ctx, fmt.Sprintf("Calling ARPScan with params: %v, %v, %v, %v, %v", b.pcapHandle, localIface, localIPNet, timeoutDur, b.JWT))
	go scan.ARPScan(b.pcapHandle, localIface, localIPNet, timeoutDur, b.JWT, results, scanDone, b.stopScanHandle)

	// Spawn receiving handler
	go func(resultsHandle chan scan.ArpScanResult, stopHandle, doneHandle chan interface{}) {
		for {
			select {
			case device := <-resultsHandle: // ARP scan result
				// Emit scanned device to frontend
				runtime.EventsEmit(b.ctx, communication.EmitTypeScanResult, device)
			case <-scanDone: // ARP scan is done
				// Emit scan done to frontend
				runtime.EventsEmit(b.ctx, communication.EmitTypeScanDone)
				return
			}
		}
	}(results, b.stopScanHandle, scanDone)
}

// StopScan stops active scan
func (b *App) StopScan() {
	close(b.stopPoisonHandle)
}

type PoisonParams struct {
	TargetIP          net.IP           `json:"targetIp"`
	TargetMAC         net.HardwareAddr `json:"targetMac"`
	LocalIface        net.Interface    `json:"localIface"`
	GatewayMAC        net.HardwareAddr `json:"gatewayMac"`
	GatewayIP         net.IP           `json:"gatewayIp"`
	BlockSleepSeconds int              `json:"blockSleepSeconds"`
}

// Poison poisons the device, and currently just blocks the connection.
func (b *App) Poison(p PoisonParams) {
	runtime.LogInfo(b.ctx, fmt.Sprintf("Called Poison() with params: %v", p))
	// Make new stop chan
	b.stopPoisonHandle = make(chan interface{})
	// Call Poison
	sleepDur := time.Second * time.Duration(p.BlockSleepSeconds)
	go poison.Poison(b.pcapHandle, b.JWT, p.LocalIface, p.TargetIP, p.TargetMAC, p.GatewayMAC, p.GatewayIP, sleepDur, b.stopPoisonHandle)
}

func (b *App) StopPoison(p PoisonParams) {
	close(b.stopPoisonHandle)
	go poison.ResetPoison(b.pcapHandle, p.TargetIP, p.TargetMAC, p.GatewayMAC, p.GatewayIP, b.JWT)
	runtime.EventsEmit(b.ctx, communication.EmitTypeBlockDone)
}
