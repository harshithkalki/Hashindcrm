import { configureStore } from '@reduxjs/toolkit';
import type { ClientState } from './clientSlice';
import userReducer from './clientSlice';

export interface RootState {
  userState: ClientState;
}

export default configureStore({
  reducer: {
    clientState: userReducer,
  },
});
