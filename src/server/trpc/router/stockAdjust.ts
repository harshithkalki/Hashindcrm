import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import type { StockAdjust } from '@/models/StockAdjust';
import StockAdjustModel from '@/models/StockAdjust';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';
import ProductModel from '@/models/Product';

export const stockAdjustRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        note: z.string().nullish(),
        operation: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create stockAdjust',
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
          message: 'You are not permitted to create stockAdjust',
        });
      }

      const stockAdjust = await StockAdjustModel.create({
        ...input,
        companyId: client.companyId,
      });

      const product = await ProductModel.findById(input.productId);

      if (!product) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Product not found',
        });
      }

      if (input.operation === 'add') {
        product.quantity += input.quantity;
      } else {
        product.quantity -= input.quantity;
      }

      await product.save();

      return stockAdjust;
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
          message: 'You are not permitted to delete stockAdjust',
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
          message: 'You are not permitted to delete stockAdjust',
        });
      }

      const stockAdjust = await StockAdjustModel.findByIdAndDelete(input.id);

      return stockAdjust;
    }),

  getAllStockAdjusts: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get stockAdjusts',
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
        message: 'You are not permitted to get stockAdjusts',
      });
    }

    const stockAdjusts = (await StockAdjustModel.find({
      companyId: client.companyId,
    }).populate('productId', 'name logo', ProductModel)) as unknown as ({
      _id: string;
    } & StockAdjust & {
        productId: { name: string; logo: string; _id: string };
      })[];

    return stockAdjusts;
  }),
});
