import type { Supplier } from '@/zobjs/supplier';
import type { Model } from 'mongoose';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ISupplier = ModifyDeep<
  Supplier,
  {
    company: mongoose.Types.ObjectId;
    warehouse: mongoose.Types.ObjectId;
  }
>;

type SupplierModel = Model<ISupplier, Record<string, never>>;

const SupplierSchema = new Schema<ISupplier, SupplierModel>(
  {
    name: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    billingAddress: { type: String, required: false },
    shippingAddress: { type: String, required: false },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    status: { type: String, required: true },
    taxNumber: { type: String, required: false },
    profile: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    openingBalance: { type: Number, required: false },
    creditLimit: { type: Number, required: false },
    creditPeriod: { type: Number, required: false },
  },
  {
    versionKey: false,
  }
);

SupplierSchema.plugin(mongoosePaginate);

SupplierSchema.index({ name: 1, company: 1 }, { unique: true });

export default (mongoose.models.Supplier as ReturnType<
  typeof mongoose.model<ISupplier, mongoose.PaginateModel<ISupplier>>
>) ||
  mongoose.model<ISupplier, mongoose.PaginateModel<ISupplier>>(
    'Supplier',
    SupplierSchema
  );
