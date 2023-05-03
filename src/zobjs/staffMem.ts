import { z } from 'zod';

export const ZStaffMemCreateInput = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string().optional(),
  role: z.string(),
  linkedTo: z.string().optional(),
  email: z.string(),
  password: z.string(),
  profile: z.string().optional(),
  warehouse: z.string().optional(),
  status: z.string(),
  reportTo: z.string().optional(),
});

export const ZAdminCreateInput = ZStaffMemCreateInput.omit({
  role: true,
  warehouse: true,
}).extend({
  company: z.string(),
});

export const ZStaffMemUpdateInput = ZStaffMemCreateInput.partial().extend({
  _id: z.string(),
});

export const ZAdminUpdateInput = ZStaffMemUpdateInput.omit({
  role: true,
});

export const ZDocWithId = z.object({
  _id: z.string(),
});

export const ZStaffMem = ZStaffMemCreateInput.extend({
  createdAt: z.string(),
  ticket: z.string().optional(),
  linkedTo: z.string().optional(),
});
