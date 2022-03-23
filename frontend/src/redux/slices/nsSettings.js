import { createSlice } from "@reduxjs/toolkit";

export const nsSlice = createSlice({
  name: "ns",
  initialState: {
    askPassword: false,
    fatalErrors: "",
    error: "",
    pcapInitialized: false,
    settings: {
      localIp: null,
      localIpNet: null,
      localIface: null,
      gateway: {
        ip: null,
        mac: null,
      },
      scanTimeoutSeconds: 6,
      blockSleepSeconds: 1,
    },
  },
  reducers: {
    setNsSettings: (state, action) => {
      state.settings = action.payload;
    },
    setLocalIp: (state, action) => {
      state.settings.localIp = action.payload;
    },
    setLocalIpNet: (state, action) => {
      state.settings.localIpNet = action.payload;
    },
    setLocalIface: (state, action) => {
      state.settings.localIface = action.payload;
    },
    setGatewayIp: (state, action) => {
      state.settings.gateway.ip = action.payload;
    },
    setGatewayMac: (state, action) => {
      state.settings.gateway.mac = action.payload;
    },
    setScanTimeoutSeconds: (state, action) => {
      state.settings.scanTimeoutSeconds = action.payload;
    },
    setBlockSleepSeconds: (state, action) => {
      state.settings.blockSleepSeconds = action.payload;
    },
    askPassword: (state) => {
      state.askPassword = true;
    },
    addFatalErrorLine: (state, action) => {
      if (state.fatalErrors !== "") {
        state.fatalErrors += " | ";
      }
      state.fatalErrors += action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPcapInitialized: (state, action) => {
      state.pcapInitialized = action.payload;
    }
  },
});

export const {
  setNsSettings,
  setLocalIp,
  setLocalIpNet,
  setLocalIface,
  setGatewayIp,
  setGatewayMac,
  setScanTimeoutSeconds,
  setBlockSleepSeconds,
  askPassword,
  addFatalErrorLine,
  setError,
  setPcapInitialized,
} = nsSlice.actions;

export default nsSlice.reducer;
