import { configureStore } from "@reduxjs/toolkit";
import assetReducer from "./assetSlice";

export default configureStore({
  reducer: {
    assets: assetReducer,
  },
});
