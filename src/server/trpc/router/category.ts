import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CategoryModel from '@/models/Category';
import checkPermission from '@/utils/checkPermission';

export const categoryRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        logo: z.string().nullish(),
        parentCategory: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CATEGORY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create category'
      );

      const category = await CategoryModel.create({
        ...input,
        companyId: client.company,
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
      const client = await checkPermission(
        'CATEGORY',
        { update: true },
        ctx.clientId,
        'You are not permitted to update category'
      );

      const category = await CategoryModel.findByIdAndUpdate(
        input.id,
        {
          ...input,
          companyId: client.company,
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
      await checkPermission(
        'CATEGORY',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete category'
      );

      const category = await CategoryModel.findByIdAndDelete(input.id);

      await CategoryModel.updateMany(
        { parentCategory: input.id },
        { parentCategory: null }
      );

      return category;
    }),

  getAllCategories: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'CATEGORY',
      {
        read: true,
        update: true,
        delete: true,
      },
      ctx.clientId,
      'You are not permitted to read categorys'
    );

    const categorys = await CategoryModel.find({ companyId: client.company });

    return categorys;
  }),
});
