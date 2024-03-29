import type { Customer } from '@/zobjs/customer';
import type { Model } from 'mongoose';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ICustomer = ModifyDeep<
  Customer,
  {
    company: mongoose.Types.ObjectId;
    warehouse: mongoose.Types.ObjectId;
  }
>;

type CustomerModel = Model<ICustomer, Record<string, never>>;

const CustomerSchema = new Schema<ICustomer, CustomerModel>(
  {
    name: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    email: { type: String, required: false },
    numbers: [
      {
        type: String,
        required: true,
      },
    ],
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

CustomerSchema.plugin(mongoosePaginate);

CustomerSchema.index({ name: 1, company: 1 }, { unique: true });

export default (mongoose.models.Customer as ReturnType<
  typeof mongoose.model<ICustomer, mongoose.PaginateModel<ICustomer>>
>) ||
  mongoose.model<ICustomer, mongoose.PaginateModel<ICustomer>>(
    'Customer',
    CustomerSchema
  );
