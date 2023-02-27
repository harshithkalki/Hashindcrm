import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { ICompany } from './Company';
import type { IProduct } from './Product';
import type { IWarehouse } from './Warehouse';

export interface StockTransferCreateInput {
  products: {
    product: Types.ObjectId | (IProduct & { _id: string });
    quantity: number;
  }[];
  createdAt: Date;
  note: string;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  shipping: number;
  orderTax: number;
  discount: number;
  warehouse: string;
  openingStockDate: Date;
  paidAmount: number;
  paymentStatus: 'pending' | 'paid';
}

export interface StockTransferUpdateInput
  extends Partial<StockTransferCreateInput>,
    DocWithId {}

export interface IStockTransfer
  extends ModifyDeep<
    StockTransferCreateInput,
    {
      warehouse: Types.ObjectId | (IWarehouse & DocWithId);
    }
  > {
  createdAt: Date;
  company: Types.ObjectId | (ICompany & { _id: string });
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
