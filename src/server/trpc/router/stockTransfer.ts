import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import type { IStockTransfer } from '@/models/StockTransfer';
import StockTransferModel from '@/models/StockTransfer';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';
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
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create stocktransfer',
        });
      }

      const isPermitted = await checkPermission(
        'STOCKADJUST',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create stocktransfer',
        });
      }

      const stocktransfer = await StockTransferModel.create({
        ...input,
        companyId: client.companyId,
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
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete stocktransfer',
        });
      }

      const isPermitted = await checkPermission(
        'STOCKADJUST',
        'delete',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete stocktransfer',
        });
      }

      const stocktransfer = await StockTransferModel.findByIdAndDelete(
        input.id
      );

      return stocktransfer;
    }),

  getAllStockTransfers: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get stocktransfers',
      });
    }

    const isPermitted = await checkPermission(
      'STOCKADJUST',
      'read',
      client?.toObject()
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get stocktransfers',
      });
    }

    const stocktransfers = await StockTransferModel.find({
      companyId: client.companyId,
    })
      .populate('warehouse', 'name')
      .lean();

    return stocktransfers;
  }),
});
