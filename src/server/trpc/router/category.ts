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

  createMany: protectedProcedure
    .input(
      z.array(
        ZCategoryCreateInput
      )
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CATEGORY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create category'
      );

      const categorys = await CategoryModel.insertMany(
        input.map((category) => ({
          ...category,
          company: client.company,
        }))
      );

      return categorys;
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

  getAllCategories: protectedProcedure.query(async ({ ctx, }) => {

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

  allLeafNodes: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'CATEGORY',
      {
        read: true,
      },
      ctx.clientId,
      'You are not permitted to read categorys'
    );

    const categories = await CategoryModel.find({
      company: client.company,
    });

    const leafNodes = categories.filter((node) => {
      const hasChildren = categories.some(
        (child) => child.parentCategory?.toString() === node._id.toString()
      );
      return !hasChildren;
    });

    return leafNodes;
  }),

  getCsv: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'CATEGORY',
      {
        read: true,
      },
      ctx.clientId,
      'You are not permitted to read categorys'
    );

    const categories = await CategoryModel.find({
      company: client.company,
    }).populate<{
      parentCategory?: {
        _id: string;
        name: string;
      };
    }>('parentCategory');

    const csv = categories.map((category) => {
      return {
        _id: category._id.toString(),
        name: category.name,
        parentCategory: category.parentCategory?.name ?? '',
        parentCategory_id: category.parentCategory?._id ?? '',
        slug: category.slug,
      };
    });

    return csv;
  }),

  getChildCategories: protectedProcedure
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
        },
        ctx.clientId,
        'You are not permitted to read categorys'
      );

      const categories = await CategoryModel.find({
        company: client.company,
        parentCategory: input._id,
      });

      return categories;
    }),

  getrootCategories: protectedProcedure.input(z.object({
    cursor: z.number().nullish(),
    limit: z.number().optional(),
    search: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    const client = await checkPermission(
      'CATEGORY',
      {
        read: true,
      },
      ctx.clientId,
      'You are not permitted to read categorys'
    );


    const { cursor: page, limit = 10, search } = input || {};

    const options = {
      page: page ?? 1,
      limit: limit,
    };

    const query = {
      company: client.company,
      parentCategory: null,
      ...(search && { name: { $regex: search, $options: 'i' } }),
    };

    const categories = await CategoryModel.paginate(query, options);

    return categories;
  }
  ),
});
