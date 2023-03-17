import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ExpenseModel from '@/models/Expense';
import checkPermission from '@/utils/checkPermission';
import { ZExpenseCreateInput, ZExpenseUpdateInput } from '@/zobjs/expense';
import type { ExpenseCategory } from '@/zobjs/expenseCategory';

export const expenseRouter = router({
  create: protectedProcedure
    .input(ZExpenseCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'EXPENSE',
        { create: true },
        ctx.clientId,
        'You are not permitted to create expense'
      );

      const expense = await ExpenseModel.create({
        ...input,
        company: client.company,
      });

      return expense;
    }),

  update: protectedProcedure
    .input(ZExpenseUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSE',
        { update: true },
        ctx.clientId,
        'You are not permitted to update expense'
      );

      const expense = await ExpenseModel.findByIdAndUpdate(input._id, input, {
        new: true,
      });

      return expense;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSE',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete expense'
      );

      const expense = await ExpenseModel.findByIdAndDelete(input._id);

      return expense;
    }),

  expenses: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'EXPENSE',
        { read: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
      );

      const { cursor: page = 1, limit = 10, search } = input || {};

      const options = {
        page: page ?? undefined,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const expenses = await ExpenseModel.paginate(query, {
        ...options,
        populate: [
          {
            path: 'category',
            model: 'ExpenseCategory',
            select: 'name',
          },
        ],
      });

      return expenses;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'EXPENSE',
        { read: true },
        ctx.clientId,
        'You are not permitted to read expense'
      );

      const expense = await ExpenseModel.findById(input._id);

      return expense;
    }),
});
