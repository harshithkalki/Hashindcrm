import { z } from 'zod';

export const ZCompanyCreateInput = z.object({
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
  logo: z.string().optional(),
  natureOfBusiness: z.string(),
  numbers: z.array(z.string()),
  pan: z.string().optional(),
  domain: z.string(),
});

export const ZCompanyUpdateInput = ZCompanyCreateInput.partial().extend({
  _id: z.string(),
});

export const ZCompany = ZCompanyCreateInput.extend({
  createdAt: z.date(),
});

export type CompanyCreateInput = z.infer<typeof ZCompanyCreateInput>;

export type CompanyUpdateInput = z.infer<typeof ZCompanyUpdateInput>;

export type Company = z.infer<typeof ZCompany>;
