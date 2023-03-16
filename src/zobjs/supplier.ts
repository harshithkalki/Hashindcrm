import { z } from 'zod';

export const ZSupplierCreateInput = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  warehouse: z.string(),
  status: z.enum(['active', 'inactive']),
  taxNumber: z.string().optional(),
  profile: z.string().optional(),
  openingBalance: z.number().optional(),
  creditLimit: z.number().optional(),
  creditPeriod: z.number().optional(),
});

export type SupplierCreateInput = z.infer<typeof ZSupplierCreateInput>;

export const ZSupplierUpdateInput = ZSupplierCreateInput.partial().extend({
  _id: z.string(),
});

export type SupplierUpdateInput = z.infer<typeof ZSupplierUpdateInput>;

export const ZSupplier = ZSupplierCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});

export type Supplier = z.infer<typeof ZSupplier>;
