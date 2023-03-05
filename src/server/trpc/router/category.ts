import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CategoryModel from '@/models/Category';
import checkPermission from '@/utils/checkPermission';
import { ZCategoryCreateInput, ZCategoryUpdateInput } from '@/zobjs/category';

export const categoryRouter = router({
  create: protectedProcedure
    .input(ZCategoryCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CATEGORY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create category'
      );

      const category = await CategoryModel.create({
        ...input,
        company: client.company,
      });

      return category;
    }),

  update: protectedProcedure
    .input(ZCategoryUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CATEGORY',
        { update: true },
        ctx.clientId,
        'You are not permitted to update category'
      );

      const category = await CategoryModel.findByIdAndUpdate(
        input._id,
        {
          $set: {
            ...input,
            company: client.company,
          },
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

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CATEGORY',
        {
          read: true,
          update: true,
          delete: true,
        },
        ctx.clientId,
        'You are not permitted to read category'
      );

      const category = await CategoryModel.findOne({
        _id: input._id,
        company: client.company,
      }).lean();

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

    const categorys = await CategoryModel.find({ company: client.company });

    return categorys;
  }),
});
