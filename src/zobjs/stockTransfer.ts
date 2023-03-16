import { z } from 'zod';

export const ZStockTransferCreateInput = z.object({
  products: z.array(
    z.object({
      product: z.string(),
      quantity: z.number(),
    })
  ),
  note: z.string().optional(),
  total: z.number(),
  status: z.union([
    z.literal('pending'),
    z.literal('approved'),
    z.literal('rejected'),
  ]),
  shipping: z.number(),
  orderTax: z.number(),
  discount: z.number(),
  fromWarehouse: z.string(),
  toWarehouse: z.string(),
  openingStockDate: z.string(),
});

export const ZStockTransferUpdateInput =
  ZStockTransferCreateInput.partial().extend({
    _id: z.string(),
  });

export const ZStockTransfer = ZStockTransferCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
  invoiceId: z.string(),
});
