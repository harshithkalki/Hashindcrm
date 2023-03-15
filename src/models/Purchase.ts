import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { PurchaseCreateInput } from '@/zobjs/purchase';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IPurchase = ModifyDeep<PurchaseCreateInput, { date: Date }> & {
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  invoiceId: string;
};

export type PurchaseDocument = mongoose.Document & IPurchase;

type PurchaseModel = Model<IPurchase, Record<string, never>>;

const PurchaseSchema: Schema = new Schema<IPurchase, PurchaseModel>(
  {
    supplier: { type: String, required: true },
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
  },
  { versionKey: false }
);

PurchaseSchema.plugin(mongoosePaginate);

PurchaseSchema.index(
  {
    invoiceId: 1,
    company: 1,
  },
  { unique: true }
);

export default (mongoose.models.Purchase as ReturnType<
  typeof mongoose.model<IPurchase, mongoose.PaginateModel<IPurchase>>
>) ||
  mongoose.model<IPurchase, mongoose.PaginateModel<IPurchase>>(
    'Purchase',
    PurchaseSchema
  );
