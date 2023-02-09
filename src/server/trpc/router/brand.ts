import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import type { IBrand } from '@/models/Brand';
import BrandModel from '@/models/Brand';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';

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
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create brand',
        });
      }

      const isPermitted = await checkPermission(
        'BRAND',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create brand',
        });
      }

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
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to update brand',
        });
      }

      const isPermitted = await checkPermission(
        'BRAND',
        'update',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to update brand',
        });
      }

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
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete brand',
        });
      }

      const isPermitted = await checkPermission(
        'BRAND',
        'delete',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete brand',
        });
      }

      const brand = await BrandModel.findByIdAndDelete(input.id);

      return brand;
    }),

  getAllBrands: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get brands',
      });
    }

    const isPermitted = await checkPermission(
      'BRAND',
      'read',
      client?.toObject()
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get brands',
      });
    }

    const brands = await BrandModel.find({
      companyId: client.companyId,
    });

    return brands;
  }),
});
