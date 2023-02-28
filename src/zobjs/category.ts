import { z } from 'zod';

export const ZCategoryCreateInput = z.object({
  name: z.string(),
  slug: z.string(),
  logo: z.string(),
  parentCategory: z.string().optional(),
});

export const ZCategoryUpdateInput = ZCategoryCreateInput.partial().extend({
  _id: z.string(),
});

export const ZCategory = ZCategoryCreateInput.extend({
  company: z.string(),
});
