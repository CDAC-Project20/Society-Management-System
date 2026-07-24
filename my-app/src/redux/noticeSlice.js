// src/redux/noticeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const noticeSlice = createSlice({
  name: "notices",
  initialState: {
    list: [],
  },
  reducers: {
    addNotice: (state, action) => {
      state.list.push(action.payload);
    },
    removeNotice: (state, action) => {
      state.list = state.list.filter((n, i) => i !== action.payload);
    },
  },
});

export const { addNotice, removeNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
