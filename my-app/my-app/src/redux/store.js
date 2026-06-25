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
