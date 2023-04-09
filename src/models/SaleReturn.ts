import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { SaleReturnCreateInput } from '@/zobjs/saleReturn';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ISaleReturn = ModifyDeep<SaleReturnCreateInput, { date: Date }> & {
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  invoiceId: string;
};

export type SaleReturnDocument = mongoose.Document & ISaleReturn;

type SaleReturnModel = Model<ISaleReturn, Record<string, never>>;

const SaleReturnSchema: Schema = new Schema<ISaleReturn, SaleReturnModel>(
  {
    customer: { type: String, required: true },
    date: { type: Date, required: true },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: { type: String, required: true },
    orderTax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    notes: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    paymentMode: { type: String, required: true },
    staffMem: { type: Schema.Types.ObjectId, ref: 'StaffMem', required: false },
  },
  { versionKey: false }
);

SaleReturnSchema.plugin(mongoosePaginate);

SaleReturnSchema.index(
  {
    invoiceId: 1,
    company: 1,
  },
  { unique: true }
);

export default (mongoose.models.SaleReturn as ReturnType<
  typeof mongoose.model<ISaleReturn, mongoose.PaginateModel<ISaleReturn>>
>) ||
  mongoose.model<ISaleReturn, mongoose.PaginateModel<ISaleReturn>>(
    'SaleReturn',
    SaleReturnSchema
  );
