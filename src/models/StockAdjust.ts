import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { z } from 'zod';
import type { ZStockAdjust } from '@/zobjs/stockAdjust';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IStockAdjust = ModifyDeep<
  z.infer<typeof ZStockAdjust>,
  {
    company: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
  }
>;

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

StockAdjustSchema.plugin(mongoosePaginate);

export default (mongoose.models.StockAdjust as ReturnType<
  typeof mongoose.model<IStockAdjust, mongoose.PaginateModel<IStockAdjust>>
>) ||
  mongoose.model<IStockAdjust, mongoose.PaginateModel<IStockAdjust>>(
    'StockAdjust',
    StockAdjustSchema
  );
