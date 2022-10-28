# Info  
## About

This template uses vanilla JS / HTML and CSS.

## Live Development

To run in live development mode, run `wails dev` in the project directory. The frontend dev server will run
on http://localhost:34115. Open this in your browser to connect to your application.

## Building

For a production build, use `wails build`.

# Networking
## Wanted functionality:
- ID devices on network (hostname, IP, MAC, OS if possible)
	- Custom label on devices
- Limit packets to go through from 0% to 100%.
  - Two options: drop packets or delay packets. Implement drop first.
- See network traffic
  - Resolve web address if possible
    - HTTPS: reverse DNS lookup
    - HTTP: grab full URI
  - Filter by type (Web, ARP, ...) 

## Implementation needed:
- Control device
  - Establish MITM ARP attack
  - Disable MITM ARP attack
- Continuous listening for packets to
  - ID Devices
    - Forward ARP data to JS
  - Packet control:
    - Drop packets by percentage
    - Stop packet
    - Pass packet through
  - ID network traffic
    - Forward network data to JS
- Ping network: Send out ARP request on network (every X seconds, commanded from JS)
## Go state needed:
- Network traffic filter
- Currently controlled device (if any)
  - IP
  - MAC
  - Packet control options
    - Delay? Stop packet? Instantly forward packet?
    - (internal) packet drop counter, for knowing if packet should be dropped or not.
- Local network interface

This state is stored at Rust level, and needs to be set from JS.