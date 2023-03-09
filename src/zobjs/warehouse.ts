import { z } from 'zod';

export const ZWarehouseCreateInput = z.object({
  name: z.string(),
  addressline1: z.string(),
  addressline2: z.string(),
  email: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string(),
  gstNo: z.string().optional(),
  cinNo: z.string().optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  logo: z.string(),
  natureOfBusiness: z.string(),
  numbers: z.array(z.string()),
  pan: z.string().optional(),
});

export const ZWarehouseUpdateInput = ZWarehouseCreateInput.partial().extend({
  _id: z.string(),
});

export const ZWarehouse = ZWarehouseCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});

export type WarehouseCreateInput = z.infer<typeof ZWarehouseCreateInput>;

export type WarehouseUpdateInput = z.infer<typeof ZWarehouseUpdateInput>;

export type Warehouse = z.infer<typeof ZWarehouse>;
