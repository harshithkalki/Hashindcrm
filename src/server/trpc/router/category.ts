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
        'BRAND',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create category',
        });
      }

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
        'BRAND',
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
        'BRAND',
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

  getAllCategorys: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to get categorys',
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
        message: 'You are not permitted to get categorys',
      });
    }
    interface ICategoryWithChildren {
      _id: string;
      name: string;
      slug: string;
      logo: string;
      companyId: string;
      allChildren: ICategoryWithChildren[];
    }

    const getAllCategoriesWithNestedChildren = async (
      companyId: string
    ): Promise<ICategoryWithChildren[] | undefined> => {
      try {
        const result = await CategoryModel.aggregate([
          {
            $match: {
              companyId: companyId,
            },
          },
          {
            $graphLookup: {
              from: 'categories',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'children',
              as: 'allChildren',
            },
          },
        ]);
        return result;
      } catch (err) {
        console.log(err);
        return undefined;
      }
    };

    const categorys = await getAllCategoriesWithNestedChildren(
      client.companyId.transform.toString()
    );

    return categorys;
  }),
});
