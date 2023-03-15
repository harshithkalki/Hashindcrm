import { z } from 'zod';

export const ZPurchaseCreateInput = z.object({
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

export const ZPurchaseUpdateInput = ZPurchaseCreateInput.partial().extend({
  id: z.string(),
});

export type PurchaseCreateInput = z.infer<typeof ZPurchaseCreateInput>;

export type PurchaseUpdateInput = z.infer<typeof ZPurchaseUpdateInput>;

export const ZPurchase = ZPurchaseCreateInput.extend({
  invoiceId: z.string(),
  createdAt: z.string(),
  company: z.string(),
});
