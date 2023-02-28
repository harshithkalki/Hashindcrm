import { z } from 'zod';

export const ZExpenseCategoryCreateInput = z.object({
  name: z.string(),
  description: z.string(),
});

export type ExpenseCategoryCreateInput = z.infer<
  typeof ZExpenseCategoryCreateInput
>;

export const ZExpenseCategoryUpdateInput =
  ZExpenseCategoryCreateInput.partial().extend({
    _id: z.string(),
  });

export type ExpenseCategoryUpdateInput = z.infer<
  typeof ZExpenseCategoryUpdateInput
>;

export const ZExpenseCategory = ZExpenseCategoryCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});

export type ExpenseCategory = z.infer<typeof ZExpenseCategory>;
