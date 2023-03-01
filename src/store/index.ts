import { configureStore } from '@reduxjs/toolkit';
import type { ClientState } from './clientSlice';
import clientReducer from './clientSlice';

export interface RootState {
  clientState: ClientState;
}

export default configureStore({
  reducer: {
    clientState: clientReducer,
  },
});
