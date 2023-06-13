import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { SaleCreateInput } from '@/zobjs/sale';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ISale = ModifyDeep<SaleCreateInput, {
  date: Date,
  customer: {
    _id?: mongoose.Types.ObjectId;
    name: string;
  }
}> & {
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  invoiceId: string;
};

export type SaleDocument = mongoose.Document & ISale;

type SaleModel = Model<ISale, Record<string, never>>;

const SaleSchema: Schema = new Schema<ISale, SaleModel>(
  {
    customer: {
      _id: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
      name: { type: String, required: true },
    },

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
    invoiceId: { type: String, required: true },
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

SaleSchema.plugin(mongoosePaginate);

SaleSchema.index(
  {
    invoiceId: 1,
    company: 1,
  },
  { unique: true }
);

export default (mongoose.models.Sale as ReturnType<
  typeof mongoose.model<ISale, mongoose.PaginateModel<ISale>>
>) || mongoose.model<ISale, mongoose.PaginateModel<ISale>>('Sale', SaleSchema);
