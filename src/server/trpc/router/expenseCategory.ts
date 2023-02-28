import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ExpenseCategoryModel from '@/models/ExpenseCategory';
import checkPermission from '@/utils/checkPermission';
import {
  ZExpenseCategoryCreateInput,
  ZExpenseCategoryUpdateInput,
} from '@/zobjs/expenseCategory';

export const expenseCategoryRouter = router({
  create: protectedProcedure
    .input(ZExpenseCategoryCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'EXPENSECATEGORY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create expenseCategory'
      );

      const expenseCategory = await ExpenseCategoryModel.create({
        ...input,
        company: client.company,
      });

      return expenseCategory;
    }),

  update: protectedProcedure
    .input(ZExpenseCategoryUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSECATEGORY',
        { update: true },
        ctx.clientId,
        'You are not permitted to update expenseCategory'
      );

      const expenseCategory = await ExpenseCategoryModel.findByIdAndUpdate(
        input._id,
        input,
        {
          new: true,
        }
      );

      return expenseCategory;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSECATEGORY',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete expenseCategory'
      );

      const expenseCategory = await ExpenseCategoryModel.findByIdAndDelete(
        input._id
      );

      return expenseCategory;
    }),

  // pagination with search expenseCategorys by name
  expenseCategorys: protectedProcedure
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
        'EXPENSECATEGORY',
        { read: true },
        ctx.clientId,
        'You are not permitted to read expenseCategory'
      );

      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const expenseCategorys = await ExpenseCategoryModel.paginate(
        query,
        options
      );

      return expenseCategorys;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSECATEGORY',
        { read: true },
        ctx.clientId,
        'You are not permitted to read expenseCategory'
      );

      const expenseCategory = await ExpenseCategoryModel.findById(input._id);

      return expenseCategory;
    }),
});
