package main

// import (
// 	"time"
// 	"testing"
// 	"netctrl.io/monitor/networking/remote"
// 	"netctrl.io/monitor/networking/scan"
// 	"netctrl.io/monitor/networking/network"
// 	"github.com/google/gopacket/pcap"
// )

// func TestScan(t *testing.T) {
// 	h, err := pcap.OpenLive(iface.Name, 65536, true, pcap.BlockForever)
// 	if err != nil {
// 		runtime.LogError(b.ctx, err.Error())
// 	}
// 	topScanHandle := make(chan interface{})
// 	results := make(chan scan.ArpScanResult)
// 	scanDone := make(chan interface{})

// 	// Start scanning
// 	timeoutDur := time.Second * time.Duration(5)
// 	go scan.ARPScan(b.pcapHandle, localIface, localIPNet, timeoutDur, b.JWT, results, scanDone, b.stopScanHandle)

// 	// Spawn receiving handler
// 	go func(resultsHandle chan scan.ArpScanResult, stopHandle, doneHandle chan interface{}) {
// 		for {
// 			select {
// 			case device := <-resultsHandle: // ARP scan result
// 				// Emit scanned device to frontend
// 				runtime.EventsEmit(b.ctx, communication.EmitTypeScanResult, device)
// 			case <-scanDone: // ARP scan is done
// 				// Emit scan done to frontend
// 				runtime.EventsEmit(b.ctx, communication.EmitTypeScanDone)
// 				return
// 			}
// 		}
// 	}(results, b.stopScanHandle, scanDone)
// }
