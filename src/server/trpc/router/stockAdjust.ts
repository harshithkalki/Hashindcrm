import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import StockAdjustModel from '@/models/StockAdjust';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import ProductModel from '@/models/Product';
import {
  ZStockAdjustCreateInput,
  ZStockAdjustUpdateInput,
} from '@/zobjs/stockAdjust';

export const stockAdjustRouter = router({
  create: protectedProcedure
    .input(ZStockAdjustCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKADJUST',
        { create: true },
        ctx.clientId,
        'You are not permitted to create stockAdjust'
      );

      const stockAdjust = await StockAdjustModel.create({
        ...input,
        company: client.company,
      });

      const product = await ProductModel.findById(input.product);

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
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'STOCKADJUST',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete stockAdjust'
      );

      const stockAdjust = await StockAdjustModel.findByIdAndDelete(input._id);

      return stockAdjust;
    }),

  getAllStockAdjusts: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'STOCKADJUST',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to get stockAdjusts'
    );

    const stockAdjusts = await StockAdjustModel.find({
      company: client.company,
    }).populate<{
      _id: string;
      product: { name: string; logo: string; _id: string };
    }>('product', 'name logo');

    return stockAdjusts;
  }),

  getStockAdjust: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'STOCKADJUST',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to get stockAdjusts'
      );

      const stockAdjust = await StockAdjustModel.findById(input._id).populate<{
        _id: string;
        product: { name: string; logo: string; _id: string };
      }>('product', 'name logo');

      return stockAdjust;
    }),
});
