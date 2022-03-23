import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    token: "",
    proUser: false,
    freeScans: 0,
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProUser: (state, action) => {
      state.proUser = action.payload;
    },
  },
});

export const { setEmail, setToken, setProUser } = userSlice.actions;

export default userSlice.reducer;
