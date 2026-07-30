//manage authantication information
//central store
//Intialization 
//action - login, logout
//login success - dispatch - action -login- modification
import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,  //this will contain id, username and role    
    token: savedToken || null,
    isAuthenticated: !!savedToken, // true if token exists
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user; // is object differnt key user other is key
      state.token = action.payload.token;  //is my key 
      state.isAuthenticated = true;   //boolean 

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;