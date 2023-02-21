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
        ctx.userId,
        'You are not permitted to create brand'
      );

      const brand = await BrandModel.create({
        ...input,
        companyId: client.companyId,
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
        ctx.userId,
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
        ctx.userId,
        'You are not permitted to delete brand'
      );

      const brand = await BrandModel.findByIdAndDelete(input.id);

      return brand;
    }),

  getAllBrands: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'BRAND',
      { read: true },
      ctx.userId,
      'You are not permitted to read brands'
    );

    const brands = await BrandModel.find({
      companyId: client.companyId,
    });

    return brands;
  }),
});
