import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import BrandModel from '@/models/Brand';
import checkPermission from '@/utils/checkPermission';

export const brandRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'BRAND',
        { create: true },
        ctx.clientId,
        'You are not permitted to create brand'
      );

      const brand = await BrandModel.create({
        ...input,
        companyId: client.company,
      });

      return brand;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'BRAND',
        { update: true },
        ctx.clientId,
        'You are not permitted to update brand'
      );

      const brand = await BrandModel.findByIdAndUpdate(input.id, input, {
        new: true,
      });

      return brand;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'BRAND',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete brand'
      );

      const brand = await BrandModel.findByIdAndDelete(input.id);

      return brand;
    }),

  // pagination with search brands by name
  brands: protectedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'BRAND',
        { read: true },
        ctx.clientId,
        'You are not permitted to read brand'
      );

      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
      };

      const query = {
        companyId: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const brands = await BrandModel.paginate(query, options);

      return brands;
    }),
});
