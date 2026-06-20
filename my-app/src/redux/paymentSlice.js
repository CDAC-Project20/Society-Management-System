import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payments",
  initialState: { bills: [], history: [] },
  reducers: {
    generateBill: (state, action) => {
      state.bills.push(action.payload);
    },
    recordPayment: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const { generateBill, recordPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
