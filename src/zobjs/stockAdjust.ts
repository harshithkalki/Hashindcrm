import { z } from 'zod';

export const ZStockAdjustCreateInput = z.object({
  product: z.string(),
  quantity: z.number(),
  note: z.string().optional(),
  operation: z.union([z.literal('add'), z.literal('remove')]),
});

export const ZStockAdjustUpdateInput = ZStockAdjustCreateInput.partial().extend(
  {
    _id: z.string(),
  }
);

export const ZStockAdjust = ZStockAdjustCreateInput.extend({
  company: z.string(),
  createdAt: z.date(),
});
