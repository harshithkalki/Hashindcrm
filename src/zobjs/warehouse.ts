import { z } from 'zod';

export const ZWarehouseCreateInput = z.object({
  name: z.string(),
});

export const ZWarehouseUpdateInput = ZWarehouseCreateInput.partial().extend({
  _id: z.string(),
});

export const ZWarehouse = ZWarehouseCreateInput.extend({
  company: z.string(),
  createdAt: z.date(),
});
