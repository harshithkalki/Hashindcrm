import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import BrandModel from '@/models/Brand';
import checkPermission from '@/utils/checkPermission';
import { ZBrandCreateInput, ZBrandUpdateInput } from '@/zobjs/brand';

export const brandRouter = router({
  create: protectedProcedure
    .input(ZBrandCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'BRAND',
        { create: true },
        ctx.clientId,
        'You are not permitted to create brand'
      );

      const brand = await BrandModel.create({
        ...input,
        company: client.company,
      });

      return brand;
    }),

  update: protectedProcedure
    .input(ZBrandUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'BRAND',
        { update: true },
        ctx.clientId,
        'You are not permitted to update brand'
      );

      const brand = await BrandModel.findByIdAndUpdate(input._id, input, {
        new: true,
      });

      return brand;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'BRAND',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete brand'
      );

      const brand = await BrandModel.findByIdAndDelete(input._id);

      return brand;
    }),

  // pagination with search brands by name
  brands: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'BRAND',
        { read: true },
        ctx.clientId,
        'You are not permitted to read brand'
      );

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const brands = await BrandModel.paginate(query, options);

      return brands;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'BRAND',
        { read: true },
        ctx.clientId,
        'You are not permitted to read brand'
      );

      const brand = await BrandModel.findById(input._id);

      return brand;
    }),
});
