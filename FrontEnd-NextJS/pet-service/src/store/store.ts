import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "@/lib/authSlice";

export type Permission = string;

export const makeStore = configureStore({
  reducer: {
    auth: authReducer,
  },

  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof makeStore;
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

// Create store instance
export const store = makeStore;
