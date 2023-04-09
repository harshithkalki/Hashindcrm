import { z } from 'zod';

export const ZSaleReturnCreateInput = z.object({
  customer: z.string(),
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
  staffMem: z.string().optional(),
});

export const ZSaleReturnUpdateInput = ZSaleReturnCreateInput.partial().extend({
  id: z.string(),
});

export type SaleReturnCreateInput = z.infer<typeof ZSaleReturnCreateInput>;

export type SaleReturnUpdateInput = z.infer<typeof ZSaleReturnUpdateInput>;

export const ZSaleReturn = ZSaleReturnCreateInput.extend({
  createdAt: z.string(),
  company: z.string(),
});
