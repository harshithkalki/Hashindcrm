import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { IProduct } from './Product';

export interface StockAdjustCreateInput {
  product: string;
  quantity: number;
  note?: string;
  operation: 'add' | 'remove';
}

export interface StockAdjustUpdateInput
  extends Partial<StockAdjustCreateInput>,
    DocWithId {}

export interface IStockAdjust
  extends ModifyDeep<
    StockAdjustCreateInput,
    {
      product: Types.ObjectId | (IProduct & DocWithId);
    }
  > {
  company: Types.ObjectId;
  createdAt: Date;
}

type StockAdjustModel = Model<IStockAdjust, Record<string, never>>;

const StockAdjustSchema: Schema = new Schema<IStockAdjust, StockAdjustModel>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    note: { type: String, required: false },
    operation: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.StockAdjust as ReturnType<
  typeof mongoose.model<IStockAdjust, StockAdjustModel>
>) ||
  mongoose.model<IStockAdjust, StockAdjustModel>(
    'StockAdjust',
    StockAdjustSchema
  );
