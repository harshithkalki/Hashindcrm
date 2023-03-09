import { z } from 'zod';

export const ZWarehouseCreateInput = z.object({
  name: z.string(),
  numbers: z.array(z.string()),
  address: z.string(),
  landline: z.array(z.string()),
  cinNo: z.string().optional(),
  gstNo: z.string().optional(),
  pan: z.string().optional(),
});

export const ZWarehouseUpdateInput = ZWarehouseCreateInput.partial().extend({
  _id: z.string(),
});

export const ZWarehouse = ZWarehouseCreateInput.extend({
  company: z.string(),
  createdAt: z.date(),
});
