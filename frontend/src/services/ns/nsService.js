import { setIsBlocking } from "../../redux/slices/blockSlice";
import {
  addFatalErrorLine,
  askPassword,
  setError,
  setGatewayIp,
  setGatewayMac,
  setLocalIface,
  setLocalIp,
  setLocalIpNet,
  setPcapInitialized,
} from "../../redux/slices/nsSettings";
import { addDevice, setIsScanning } from "../../redux/slices/scanSlice";
import rStore from "../../redux/store";
import {
  getDefaultLocalIp,
  getGatewayIp,
  getGatewayMac,
  getIfaceFromIp,
  getIpNetFromIp,
  initPcap,
} from "./nsFunctions";

const store = rStore;

// Note: be careful to check if system needs special permissions first.
export const spawnNs = async () => {
  // await invoke("spawn_ns");
};

export const checkPermsAndSpawnNs = () => {
  // const current = getCurrent();
  // current.emit("kill_ns", "").then();

  // // Check permissions and fix 'em for each OS.
  // invoke("get_platform").then((p) => {
  //   if (p === "linux" || p === "macos") {
  //     invoke("needs_permissions_set").then((n) => {
  //       if (n === true) {
  //         console.log("needs perms!");
  //         store.dispatch(askPassword());
  //       } else {
  //         spawnNs().then();
  //       }
  //     });
  //   } else if (p === "windows") {
  //     spawnNs().then();
  //   }
  // });
};

export const setupNs = async () => {
  // const current = getCurrent();
  // checkPermsAndSpawnNs();

  // await current.listen("ns_fatal_error", (event) => {
  //   store.dispatch(addFatalErrorLine(event.payload));
  //   console.log("Fatal error: ", event.payload);
  // });
  // await current.listen("from_ns", (event) => {
  //   // Reducer
  //   const payload = JSON.parse(event.payload);
  //   console.log("Parsed payload from NS:", payload);
  //   switch (payload.type) {
  //     case "ready":
  //       // Initialize NS by getting LocalIP and gateway
  //       getDefaultLocalIp();
  //       getGatewayIp();
  //       break;
  //     case "scanDone":
  //       store.dispatch(setIsScanning(false));
  //       break;
  //     case "scanResult":
  //       store.dispatch(addDevice(payload.data));
  //       break;
  //     case "blockDone":
  //       store.dispatch(setIsBlocking(false));
  //       break;
  //     case "defaultLocalIp":
  //       if (store.getState().ns.settings.localIp == null) {
  //         getIpNetFromIp(payload.data.ip);
  //         getIfaceFromIp(payload.data.ip);
  //       }
  //       store.dispatch(setLocalIp(payload.data.ip));
  //       break;
  //     case "ipNetFromIp":
  //       store.dispatch(setLocalIpNet(payload.data.ipNet));
  //       break;
  //     case "ifaceFromIp":
  //       if (store.getState().ns.settings.localIface == null) {
  //         initPcap(payload.data.iface);
  //       }
  //       store.dispatch(setLocalIface(payload.data.iface));
  //       break;
  //     case "gatewayIp":
  //       if (store.getState().ns.settings.gateway.mac == null) {
  //         getGatewayMac(payload.data.ip);
  //       }
  //       store.dispatch(setGatewayIp(payload.data.ip));
  //       break;
  //     case "gatewayMac":
  //       store.dispatch(setGatewayMac(payload.data.mac));
  //       break;
  //     case "initializedPcap":
  //       store.dispatch(setPcapInitialized(true));
  //       break;
  //     case "error":
  //       console.log("received error type");
  //       store.dispatch(setError(payload.data.msg));
  //       break;
  //     default:
  //       break;
  //   }
  // });
  // await current.listen("error_spawning_ns", (event) => {
  //   store.dispatch(addFatalErrorLine(event.payload));
  //   console.error("Failed to spawn NS: ", event.payload);
  // });
};
