import type { RouterOutputs } from '@/utils/trpc';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Client = RouterOutputs['auth']['me']['data'];

export interface ClientState {
  client?: Client;
  warehouse?: string;
}

const clientSlice = createSlice({
  name: 'client',
  initialState: { client: undefined } as ClientState,
  reducers: {
    setClient: (state, action: PayloadAction<Client>) => {
      state.client = action.payload;
    },
    setWarehouse: (state, action: PayloadAction<string>) => {
      state.warehouse = action.payload;
    },
  },
});

export const { setClient, setWarehouse } = clientSlice.actions;

export default clientSlice.reducer;
