import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface StockAdjust {
  productId: ObjectId;
  quantity: number;
  companyId: ObjectId;
  createdAt: Date;
  note?: string;
  operation: 'add' | 'remove';
}

type StockAdjustModel = Model<StockAdjust, Record<string, never>>;

const StockAdjustSchema: Schema = new Schema<StockAdjust, StockAdjustModel>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    note: { type: String, required: false },
    operation: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.StockAdjust as ReturnType<
  typeof mongoose.model<StockAdjust, StockAdjustModel>
>) ||
  mongoose.model<StockAdjust, StockAdjustModel>(
    'StockAdjust',
    StockAdjustSchema
  );
