import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: {
    _id: string;
    name: string;
  };
  linkedTo?: {
    _id: string;
  };
  companyId: {
    _id: string;
  };
  email: string;
  password: string;
  createdAt: string;
  ticket?: { _id: string };
}

export interface UserState {
  user?: User;
}

const userSlice = createSlice({
  name: 'user',
  initialState: { user: undefined } as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
