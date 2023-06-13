import { z } from 'zod';

export const ZSaleCreateInput = z.object({
  customer: z.string().optional(),
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

export const ZSaleUpdateInput = ZSaleCreateInput.partial().extend({
  id: z.string(),
});

export type SaleCreateInput = z.infer<typeof ZSaleCreateInput>;

export type SaleUpdateInput = z.infer<typeof ZSaleUpdateInput>;

export const ZSale = ZSaleCreateInput.extend({
  invoiceId: z.string(),
  createdAt: z.string(),
  company: z.string(),
});

export type Sale = z.infer<typeof ZSale>;
