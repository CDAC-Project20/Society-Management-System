<<<<<<< HEAD
import { configureStore } from "@reduxjs/toolkit";  //configureStore is function
import authReducer from "./authSlice";

export const store = configureStore({  
    reducer: {
        auth: authReducer, // auth is used in authonthication component for vaild user login and protection
    },
});
=======
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import complaintReducer from "./complaintSlice";
import paymentReducer from "./paymentSlice";
//import visitorReducer from "./visitorSlice";
//import facilityReducer from "./facilitySlice";
import noticeReducer from "./noticeSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
    payments: paymentReducer,
    //visitors: visitorReducer,
    //facilities: facilityReducer,
    notices: noticeReducer,
    admin: adminReducer,
  },
});
>>>>>>> 281242e96f0f1e3574ff2b361eb594b98bbe8215
