function sendToNS(unserializedData) {
  // const current = getCurrent();
  // current.emit("to_ns", JSON.stringify(unserializedData)).then();
}

export function block(device, iface, gateway, blockSleepSeconds, jwt) {
  // sendToNS({
  //   type: "block",
  //   data: {
  //     targetIp: device.ip,
  //     targetMac: device.mac,
  //     localIface: iface,
  //     gatewayMac: gateway.mac,
  //     gatewayIp: gateway.ip,
  //     blockSleepSeconds,
  //     jwt,
  //   },
  // });
}
export function unblock(device, iface, gateway, jwt) {
  // sendToNS({
  //   type: "unblock",
  //   data: {
  //     targetIp: device.ip,
  //     targetMac: device.mac,
  //     localIface: iface,
  //     gatewayMac: gateway.mac,
  //     gatewayIp: gateway.ip,
  //     jwt: jwt,
  //   },
  // });
}
export function scan(iface, ipnet, scanTimeout, jwt) {
  // console.log("received ipnet in scan:", ipnet);
  // sendToNS({
  //   type: "scan",
  //   data: {
  //     localIface: iface,
  //     localIpnet: ipnet,
  //     scanTimeoutSeconds: scanTimeout,
  //     jwt,
  //   },
  // });
}
export function getDefaultLocalIp() {
  // sendToNS({
  //   type: "getDefaultLocalIp",
  //   data: {},
  // });
}
export function getIpNetFromIp(ip) {
  // sendToNS({
  //   type: "getIpNetFromIp",
  //   data: {
  //     ip,
  //   },
  // });
}
export function getIfaceFromIp(ip) {
  // sendToNS({
  //   type: "getIfaceFromIp",
  //   data: {
  //     ip,
  //   },
  // });
}
export function getGatewayIp() {
  // sendToNS({
  //   type: "getGatewayIp",
  //   data: {},
  // });
}
export function getGatewayMac(gatewayIp) {
  // sendToNS({
  //   type: "getGatewayMac",
  //   data: {
  //     gatewayIp,
  //   },
  // });
}
export function initPcap(iface) {
  // sendToNS({
  //   type: "initPcap",
  //   data: {
  //     iface,
  //   },
  // });
}
