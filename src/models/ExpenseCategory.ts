import type { ExpenseCategory } from '@/zobjs/expenseCategory';
import type { Model } from 'mongoose';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IExpenseCategory = ModifyDeep<
  ExpenseCategory,
  {
    company: mongoose.Types.ObjectId;
  }
>;

type ExpenseCategoryModel = Model<IExpenseCategory, Record<string, never>>;

const ExpenseCategorySchema = new Schema<
  IExpenseCategory,
  ExpenseCategoryModel
>(
  {
    name: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

ExpenseCategorySchema.plugin(mongoosePaginate);

ExpenseCategorySchema.index({ name: 1, company: 1 }, { unique: true });

export default (mongoose.models.ExpenseCategory as ReturnType<
  typeof mongoose.model<
    IExpenseCategory,
    mongoose.PaginateModel<IExpenseCategory>
  >
>) ||
  mongoose.model<IExpenseCategory, mongoose.PaginateModel<IExpenseCategory>>(
    'ExpenseCategory',
    ExpenseCategorySchema
  );
