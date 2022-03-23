import { createSlice } from "@reduxjs/toolkit";

// Dummy data:
//   [{
//     ip: "192.168.1.1",
//     mac: "04:92:26:da:36:2b",
//     hostnames: ["Azur.probox.router"],
//     vendor: "Azur"
//   },
//   {
//     ip: "192.168.1.122",
//     mac: "00:22:07:4a:21:d4",
//     hostnames: ["John.smartphone"],
//     vendor: "Hauxi"
//   },
//   {
//     ip: "192.168.1.198",
//     mac: "c4:b3:01:99:b5:0a",
//     hostnames: ["PS4.livingroom"],
//     vendor: "PlayBox"
//   },
//   {
//     ip: "192.168.1.141",
//     mac: "00:e1:8c:8d:3b:69",
//     hostnames: ["Alex.ProBook"],
//     vendor: "Pear"
//   },
//   {
//     ip: "192.168.1.233",
//     mac: "d4:2c:0f:19:89:3e",
//     hostnames: ["SmartTV.kitchen"],
//     vendor: "Filips"
//   },
// ],

export const scanSlice = createSlice({
  name: "scan",
  initialState: {
    isScanning: false,
    devices: [],
    scanTimeout: 6, // In seconds
  },
  reducers: {
    addDevice: (state, action) => {
      // If device isn't already added
      let alreadyExists = false;
      state.devices.forEach((x) => {
        if (x.mac === action.payload.mac) {
          alreadyExists = true;
        }
      });
      if (!alreadyExists) {
        state.devices.push(action.payload);
      }
    },
    clearDevices: (state) => {
      state.devices = [];
    },
    setIsScanning: (state, action) => {
      state.isScanning = action.payload;
    },
  },
});

export const { addDevice, clearDevices, setIsScanning } = scanSlice.actions;

export default scanSlice.reducer;
