import { createSlice } from "@reduxjs/toolkit";

export const blockSlice = createSlice({
  name: "block",
  initialState: {
    isBlocking: false,
  },
  reducers: {
    setIsBlocking: (state, action) => {
      state.isBlocking = action.payload;
    },
  },
});

export const { setIsBlocking } = blockSlice.actions;

export default blockSlice.reducer;
