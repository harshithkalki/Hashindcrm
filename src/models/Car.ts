import type { ZCar } from '@/zobjs/car';
import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { z } from 'zod';

export type ICar = ModifyDeep<
  z.infer<typeof ZCar>,
  {
    company: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
  }
>;

export type CarDocument = mongoose.Document & ICar;

type CarModel = Model<ICar, Record<string, never>>;

const CarSchema: Schema = new Schema<ICar, CarModel>(
  {
    emissionType: { type: String },
    exteriorColor: { type: String },
    fuelType: { type: String },
    interiorColor: { type: String },
    maker: { type: String },
    meterReading: { type: String },
    model: { type: String },
    purchaseDate: { type: String },
    registrationNumber: { type: String },
    renewalDate: { type: String },
    transmissionType: { type: String },
    vehicleType: { type: String },
    wheelDriveType: { type: String },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    insuranceDate: { type: String },
    insurancePeriod: { type: String },
  },
  {
    versionKey: false,
  }
);

CarSchema.plugin(mongoosePaginate);

CarSchema.index({ name: 1, companyId: 1 }, { unique: true });
CarSchema.index({ slug: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Car as ReturnType<
  typeof mongoose.model<ICar, mongoose.PaginateModel<ICar>>
>) || mongoose.model<ICar, mongoose.PaginateModel<ICar>>('Car', CarSchema);
