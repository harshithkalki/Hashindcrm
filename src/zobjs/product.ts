import { z } from 'zod';

export const ZProductCreateInput = z.object({
  name: z.string(),
  slug: z.string(),
  logo: z.string().optional(),
  quantity: z.number(),
  quantityAlert: z.number(),
  category: z.string(),
  brand: z.string(),
  barcodeSymbology: z.string(),
  itemCode: z.string(),
  openingStock: z.number(),
  openingStockDate: z.string(),
  purchasePrice: z.number(),
  salePrice: z.number(),
  tax: z.number(),
  mrp: z.number(),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
  warehouse: z.string(),
});

export const ZProductUpdateInput = ZProductCreateInput.partial().extend({
  _id: z.string(),
});

export const ZProduct = ZProductCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});
