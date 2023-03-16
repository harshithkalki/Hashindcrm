import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { z } from 'zod';
import type { ZStockTransfer } from '@/zobjs/stockTransfer';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IStockTransfer = Omit<
  ModifyDeep<
    z.infer<typeof ZStockTransfer>,
    {
      company: Types.ObjectId;
      warehouse: Types.ObjectId;
      openingStockDate: Date;
    }
  >,
  'products'
> & {
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
};

type StockTransferModel = Model<IStockTransfer, Record<string, never>>;

const StockTransferSchema: Schema = new Schema<
  IStockTransfer,
  StockTransferModel
>(
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
    formWarehouse: {
      type: String,
      required: true,
    },
    toWarehouse: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

StockTransferSchema.plugin(mongoosePaginate);

export default (mongoose.models.StockTransfer as ReturnType<
  typeof mongoose.model<IStockTransfer, mongoose.PaginateModel<IStockTransfer>>
>) ||
  mongoose.model<IStockTransfer, mongoose.PaginateModel<IStockTransfer>>(
    'StockTransfer',
    StockTransferSchema
  );
