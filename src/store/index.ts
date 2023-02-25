import { configureStore } from '@reduxjs/toolkit';
import type { UserState } from './userSlice';
import userReducer from './userSlice';

export interface RootState {
  userState: UserState;
}

export default configureStore({
  reducer: {
    userState: userReducer,
  },
});
