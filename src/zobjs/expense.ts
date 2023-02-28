import { z } from 'zod';

export const ZExpenseCreateInput = z.object({
  category: z.string(),
  amount: z.number(),
  date: z.string(),
  notes: z.string(),
});

export type ExpenseCreateInput = z.infer<typeof ZExpenseCreateInput>;

export const ZExpenseUpdateInput = ZExpenseCreateInput.partial().extend({
  _id: z.string(),
});

export type ExpenseUpdateInput = z.infer<typeof ZExpenseUpdateInput>;

export const ZExpense = ZExpenseCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});

export type Expense = z.infer<typeof ZExpense>;
