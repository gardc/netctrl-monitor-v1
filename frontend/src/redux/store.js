import { configureStore } from "@reduxjs/toolkit";
import scanReducer from "./slices/scanSlice";
import blockReducer from "./slices/blockSlice";
import nsSettingsReducer from "./slices/nsSettings";
import userReducer from "./slices/userSlice";

export default configureStore({
  reducer: {
    scan: scanReducer,
    block: blockReducer,
    ns: nsSettingsReducer,
    user: userReducer,
  },
});
