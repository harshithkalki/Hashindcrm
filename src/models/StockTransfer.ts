import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { CompanyDocument } from './Company';
import type { ProductDocument } from './Product';
import type { WarehouseDocument } from './Warehouse';

export interface IStockTransfer {
  products: {
    product: Types.ObjectId | ProductDocument;
    quantity: number;
  }[];
  createdAt: Date;
  note: string;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  shipping: number;
  orderTax: number;
  discount: number;
  companyId: Types.ObjectId | CompanyDocument;
  warehouse: Types.ObjectId | WarehouseDocument;
  openingStockDate: Date;
  paidAmount: number;
  paymentStatus: 'pending' | 'paid';
}

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
    companyId: {
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
