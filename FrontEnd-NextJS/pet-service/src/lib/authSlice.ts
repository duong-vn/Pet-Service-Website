import { RootState } from "@/store/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Permission = string;

export type Role = {
  _id: string;
  name: string;
};
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  age?: number;
  picture?: string;
phone?:string,
  createdAt?: string;
  gender?: string;
  address?: string;
  permissions: Permission[];
}

export interface AuthState {
  user: IUser | null;
  authenticated: 'checking'|'authenticated'|'unauthenticated';
}

const initialState: AuthState = {
  user: null,
  authenticated: 'checking',
};  

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.authenticated = 'authenticated';
    },
    clearAuth(state) {
      state.user = null;
      state.authenticated = 'unauthenticated';
    },
    
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const simpleInfoSelector = createSelector(
  (s: RootState) => s.auth,
  (auth) => ({
    authenticated: auth.authenticated,
    name: auth.user?.name,
    email: auth.user?.email,
    picture: auth.user?.picture ?? null,
  })
);

export const can = (permissions: Permission[] | undefined, perm: Permission) =>
  !!permissions?.includes(perm);
