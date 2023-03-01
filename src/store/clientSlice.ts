import type { RouterOutputs } from '@/utils/trpc';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Client = RouterOutputs['auth']['me']['data'];

export interface ClientState {
  client?: Client;
}

const clientSlice = createSlice({
  name: 'client',
  initialState: { client: undefined } as ClientState,
  reducers: {
    setClient: (state, action: PayloadAction<Client>) => {
      state.client = action.payload;
    },
  },
});

export const { setClient } = clientSlice.actions;

export default clientSlice.reducer;
