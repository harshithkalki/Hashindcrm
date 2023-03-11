import type { Types } from 'mongoose';
import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { z } from 'zod';
import type { ZWarehouse } from '@/zobjs/warehouse';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IWarehouse = Omit<z.infer<typeof ZWarehouse>, 'company'> & {
  company: Types.ObjectId;
};

type WarehouseModel = Model<IWarehouse, Record<string, never>>;

export type WarehouseDocument = mongoose.Document & IWarehouse;

const WarehouseSchema: Schema = new Schema<IWarehouse, WarehouseModel>(
  {
    name: { type: String, required: true, unique: true },
    addressline1: { type: String, required: true },
    addressline2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    gstNo: { type: String, required: false },
    cinNo: { type: String, required: false },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    logo: { type: String, required: true },
    natureOfBusiness: { type: String, required: true },
    email: { type: String, required: true },
    numbers: [
      {
        type: String,
        required: true,
      },
    ],
    pan: { type: String, required: false },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    bankName: { type: String, required: false },
    branchName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
  },

  {
    versionKey: false,
  }
);

WarehouseSchema.index({ name: 1, companyId: 1 }, { unique: true });

WarehouseSchema.plugin(mongoosePaginate);

export default (mongoose.models.Warehouse as ReturnType<
  typeof mongoose.model<IWarehouse, mongoose.PaginateModel<IWarehouse>>
>) ||
  mongoose.model<IWarehouse, mongoose.PaginateModel<IWarehouse>>(
    'Warehouse',
    WarehouseSchema
  );
