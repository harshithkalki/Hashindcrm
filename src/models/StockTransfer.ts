import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { z } from 'zod';
import type { ZStockTransfer } from '@/zobjs/stockTransfer';

export type IStockTransfer = ModifyDeep<
  z.infer<typeof ZStockTransfer>,
  {
    company: Types.ObjectId;
    products: {
      product: Types.ObjectId;
      quantity: number;
    }[];
    warehouse: Types.ObjectId;
    openingStockDate: Date;
  }
>;

type StockAdjustModel = Model<IStockTransfer, Record<string, never>>;

const StockAdjustSchema: Schema = new Schema<IStockTransfer, StockAdjustModel>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    orderTax: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    openingStockDate: {
      type: Date,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'pending',
    },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.StockTransfer as ReturnType<
  typeof mongoose.model<IStockTransfer, StockAdjustModel>
>) ||
  mongoose.model<IStockTransfer, StockAdjustModel>(
    'StockTransfer',
    StockAdjustSchema
  );
