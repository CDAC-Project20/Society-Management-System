import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaints",
  initialState: { list: [] },
  reducers: {
    addComplaint: (state, action) => {
      state.list.push(action.payload);
    },
    resolveComplaint: (state, action) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.list[index].status = "Resolved";
    },
  },
});

export const { addComplaint, resolveComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;
