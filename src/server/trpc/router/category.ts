import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CategoryModel from '@/models/Category';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import UserModel from '@/models/User';

export const categoryRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
        parentCategory: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create category',
        });
      }

      const isPermitted = await checkPermission(
        'CATEGORY',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create category',
        });
      }

      console.log('input', input);

      const category = await CategoryModel.create({
        ...input,
        companyId: client.companyId,
      });

      return category;
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
          message: 'You are not permitted to update category',
        });
      }

      const isPermitted = await checkPermission(
        'CATEGORY',
        'update',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to update category',
        });
      }

      const category = await CategoryModel.findByIdAndUpdate(
        input.id,
        {
          ...input,
          companyId: client.companyId,
        },
        {
          new: true,
        }
      );

      return category;
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
          message: 'You are not permitted to delete category',
        });
      }

      const isPermitted = await checkPermission(
        'CATEGORY',
        'delete',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to delete category',
        });
      }

      const category = await CategoryModel.findByIdAndDelete(input.id);

      return category;
    }),

  getAllCategories: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get categorys',
      });
    }

    const isPermitted = await checkPermission(
      'CATEGORY',
      'read',
      client?.toObject()
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get categorys',
      });
    }
    const categorys = await CategoryModel.find({ companyId: client.companyId });

    return categorys;
  }),
});
