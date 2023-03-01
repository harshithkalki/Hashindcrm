import { z } from 'zod';

export const ZBrandCreateInput = z.object({
  name: z.string(),
  slug: z.string(),
  logo: z.string(),
});

export type BrandCreateInput = z.infer<typeof ZBrandCreateInput>;

export const ZBrandUpdateInput = ZBrandCreateInput.partial().extend({
  _id: z.string(),
});

export const ZBrand = ZBrandCreateInput.extend({
  company: z.string(),
});
