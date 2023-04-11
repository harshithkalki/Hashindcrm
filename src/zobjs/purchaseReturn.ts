import { z } from 'zod';

export const ZPurchaseReturnCreateInput = z.object({
  supplier: z.string(),
  date: z.string(),
  products: z.array(
    z.object({
      _id: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  status: z.enum(['pending', 'approved', 'rejected']),
  orderTax: z.number(),
  shipping: z.number(),
  discount: z.number(),
  total: z.number(),
  notes: z.string().optional(),
  warehouse: z.string().optional(),
  paymentMode: z.enum(['cash', 'card', 'upi']),
});

export const ZPurchaseReturnUpdateInput = ZPurchaseReturnCreateInput.partial().extend({
  id: z.string(),
});

export type PurchaseReturnCreateInput = z.infer<typeof ZPurchaseReturnCreateInput>;

export type PurchaseReturnUpdateInput = z.infer<typeof ZPurchaseReturnUpdateInput>;

export const ZPurchaseReturn = ZPurchaseReturnCreateInput.extend({
  createdAt: z.string(),
  company: z.string(),
});
