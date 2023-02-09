import { configureStore } from '@reduxjs/toolkit';
import type { UserState } from './userSlice';
import userReducer from './userSlice';

export interface RootState {
  user: UserState;
}

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
