import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import StockTransferModel from '@/models/StockTransfer';
import checkPermission from '@/utils/checkPermission';
import ProductModel from '@/models/Product';

export const stockTransferRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            product: z.string(),
            quantity: z.number(),
          })
        ),
        note: z.string(),
        total: z.number(),
        status: z.string(),
        shipping: z.number(),
        orderTax: z.number(),
        discount: z.number(),
        warehouse: z.string(),
        openingStockDate: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKADJUST',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create stocktransfer'
      );

      const stocktransfer = await StockTransferModel.create({
        ...input,
        company: client.company,
      });

      await Promise.all(
        input.products.map(async (product) => {
          const productData = await ProductModel.findById(product.product);
          if (productData) {
            productData.quantity = productData.quantity - product.quantity;
            await productData.save();
          }
          return product;
        })
      );

      return stocktransfer;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKADJUST',
        {
          delete: true,
        },
        ctx.clientId,
        'You are not permitted to delete stocktransfer'
      );

      const stocktransfer = await StockTransferModel.findByIdAndDelete(
        input.id
      );

      return stocktransfer;
    }),

  getAllStockTransfers: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'STOCKADJUST',
      {
        read: true,
      },
      ctx.clientId,
      'You are not permitted to get stocktransfers'
    );

    const stocktransfers = await StockTransferModel.find({
      company: client.company,
    })
      .populate('warehouse', 'name')
      .lean();

    return stocktransfers;
  }),
});
