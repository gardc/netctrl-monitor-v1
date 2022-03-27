import rStore from "../../redux/store";
import {
  setGatewayIp,
  setGatewayMacObj, setLocalIface,
  setLocalIp,
  setLocalIpNet,
  setPcapInitialized
} from "../../redux/slices/nsSettings";

const store = rStore;

export function block(device, iface, gateway, blockSleepSeconds) {
  window.go.main.App.Poison({
    targetIp: device.ip,
    targetMac: device.mac,
    localIface: iface,
    gatewayMac: gateway.mac.bytes,
    gatewayIp: gateway.ip,
    blockSleepSeconds,
  }).then();
}

export function unblock(device, iface, gateway) {
  window.go.main.App.StopPoison({
    targetIp: device.ip,
    targetMac: device.mac,
    localIface: iface,
    gatewayMac: gateway.mac.bytes,
    gatewayIp: gateway.ip,
  }).then();
}

export function scan(iface, ipnet, scanTimeout) {
  window.go.main.App.Scan(iface, ipnet, scanTimeout).then();
}

export async function getDefaultLocalIp() {
  return await window.go.main.App.GetDefaultLocalIP();
}

export async function getIpNetFromIp(ip) {
  return await window.go.main.App.GetIPNetFromIP(ip);
}

export async function getIfaceFromIp(ip) {
  return await window.go.main.App.GetIfaceFromIP(ip);
}

export async function getGatewayIp() {
  return await window.go.main.App.GetGatewayIP();
}

export async function lookupArpTable(ip) {
  return await window.go.main.App.LookupARPTable(ip);
}

export async function initBackend() {
  const localIp = await getDefaultLocalIp();
  const gatewayIp = await getGatewayIp();
  const gatewayMac = await lookupArpTable(gatewayIp);
  const localIpNet = await getIpNetFromIp(localIp);
  const localIface = await getIfaceFromIp(localIp);
  window.go.main.App.Initialize(localIface).then(async () => {
    console.log(
      "Init values: ",
      localIp,
      gatewayIp,
      gatewayMac,
      localIpNet,
      localIface
    );
    store.dispatch(setPcapInitialized(true));
    store.dispatch(setLocalIp(localIp));
    store.dispatch(setGatewayIp(gatewayIp));
    store.dispatch(setGatewayMacObj(gatewayMac));
    store.dispatch(setLocalIpNet(localIpNet));
    store.dispatch(setLocalIface(localIface));
  });
}

export function setJWT(jwt) {
  window.go.main.App.SetJWT(jwt).then();
}

export async function getVersion() {
  return await window.go.main.App.GetVersion();
}

export async function getMacFromString(macString) {
  return await window.go.main.App.GetMACFromString(macString);
}