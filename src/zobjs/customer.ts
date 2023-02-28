import { z } from 'zod';

export const ZCustomerCreateInput = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  billingAddress: z.string(),
  shippingAddress: z.string(),
  warehouse: z.string(),
  status: z.enum(['active', 'inactive']),
  taxNumber: z.string(),
  profile: z.string(),
  openingBalance: z.number(),
  creditLimit: z.number(),
  creditPeriod: z.number(),
});

export type CustomerCreateInput = z.infer<typeof ZCustomerCreateInput>;

export const ZCustomerUpdateInput = ZCustomerCreateInput.partial().extend({
  _id: z.string(),
});

export type CustomerUpdateInput = z.infer<typeof ZCustomerUpdateInput>;

export const ZCustomer = ZCustomerCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});

export type Customer = z.infer<typeof ZCustomer>;
