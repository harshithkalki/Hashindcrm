import { z } from 'zod';

export const ZStaffMemCreateInput = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  phoneNumber: z.string(),
  addressline1: z.string(),
  addressline2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  role: z.string(),
  linkedTo: z.string().optional(),
  email: z.string(),
  password: z.string(),
});

export const ZStaffMemUpdateInput = ZStaffMemCreateInput.partial().extend({
  _id: z.string(),
});

export const ZDocWithId = z.object({
  _id: z.string(),
});

export const ZStaffMem = ZStaffMemCreateInput.extend({
  createdAt: z.date(),
  ticket: z.string().optional(),
  linkedTo: z.string().optional(),
});
