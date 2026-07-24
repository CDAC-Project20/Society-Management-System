//manage authantication information
//central store
//Intialization 
//action - login, logout
//login success - dispatch - action -login- modification
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState:{    
    user: null,  //this will contain id, username and role    
    token: null,
    isAuthenticated: false,
  }, 
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user; // is object differnt key user other is key
      state.token = action.payload.token;  //is my key 
      state.isAuthenticated = true;   //boolean 
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;