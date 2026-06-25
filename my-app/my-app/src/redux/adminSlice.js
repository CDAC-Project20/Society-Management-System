// src/redux/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardData: [],
    settings: {},
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { setDashboardData, updateSettings } = adminSlice.actions;
export default adminSlice.reducer;
