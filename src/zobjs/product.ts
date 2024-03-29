import { z } from 'zod';

export const ZProductCreateInput = z.object({
  name: z.string(),
  slug: z.string().optional(),
  logo: z.string().optional(),
  quantity: z.number(),
  quantityAlert: z.number(),
  category: z.string(),
  brand: z.string(),
  barcodeSymbology: z.string().optional(),
  itemCode: z.string().optional(),
  openingStock: z.number(),
  openingStockDate: z.string(),
  purchasePrice: z.number(),
  salePrice: z.number(),
  tax: z.number(),
  mrp: z.number(),
  expiryDate: z.string().optional().transform((val) => val || undefined),
  description: z.string().optional(),
  warehouse: z.string(),
});

export type ProductCreateInput = z.infer<typeof ZProductCreateInput>;

export const ZProductUpdateInput = ZProductCreateInput.partial().extend({
  _id: z.string(),
});

export const ZProduct = ZProductCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});



export type Product = z.infer<typeof ZProduct>;
