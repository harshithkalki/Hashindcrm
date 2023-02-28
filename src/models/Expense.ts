import type { Expense } from '@/zobjs/expense';
import type { Model } from 'mongoose';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IExpense = ModifyDeep<
  Expense,
  {
    company: mongoose.Types.ObjectId;
  }
>;

type ExpenseModel = Model<IExpense, Record<string, never>>;

const ExpenseSchema = new Schema<IExpense, ExpenseModel>(
  {
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    createdAt: { type: Date, default: Date.now },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    notes: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

ExpenseSchema.plugin(mongoosePaginate);

ExpenseSchema.index({ name: 1, company: 1 }, { unique: true });

export default (mongoose.models.Expense as ReturnType<
  typeof mongoose.model<IExpense, mongoose.PaginateModel<IExpense>>
>) ||
  mongoose.model<IExpense, mongoose.PaginateModel<IExpense>>(
    'Expense',
    ExpenseSchema
  );
