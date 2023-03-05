import { z } from 'zod';

export const ZCategoryCreateInput = z.object({
  name: z.string(),
  slug: z.string(),
  logo: z.string().optional(),
  parentCategory: z.string().optional(),
});

export type CategoryCreateInput = z.infer<typeof ZCategoryCreateInput>;

export const ZCategoryUpdateInput = ZCategoryCreateInput.partial().extend({
  _id: z.string(),
});

export const ZCategory = ZCategoryCreateInput.extend({
  company: z.string(),
});
