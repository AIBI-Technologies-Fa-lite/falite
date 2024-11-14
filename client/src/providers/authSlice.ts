import { createSlice } from "@reduxjs/toolkit";
import { Role } from "@constants/enum";
import { RootState } from "src/store";

type User = {
  id: string;
  firstName: string;
  role: Role;
  working: boolean;
};

type AuthState = {
  user: User | null;
  session: boolean;
};

const initialState: AuthState = {
  user: null,
  session: true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // To set the state after successfull login
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.session = true;
    },
    setWorking: (state) => {
      if (state.user) {
        state.user.working = !state.user?.working;
      }
    },
    logout: (state) => {
      state.user = null;
    },
    changeSession: (state) => {
      state.session = !state.session;
    }
  }
});

export const { setCredentials, logout, changeSession, setWorking } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectSession = (state: RootState) => state.auth.session;
export const authReducer = authSlice.reducer;
