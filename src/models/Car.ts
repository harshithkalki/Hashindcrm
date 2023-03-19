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
    emissionType: { type: String, required: false },
    exteriorColor: { type: String, required: false },
    fuelType: { type: String, required: false },
    interiorColor: { type: String, required: false },
    make: { type: String, required: true },
    meterReading: { type: String, required: false },
    model: { type: String, required: false },
    purchaseDate: { type: String, required: false },
    registrationNumber: { type: String, required: true },
    renewalDate: { type: String, required: false },
    transmissionType: { type: String, required: false },
    vehicleType: { type: String, required: false },
    wheelDriveType: { type: String, required: false },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    insuranceDate: { type: String, required: false },
    insurancePeriod: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

CarSchema.plugin(mongoosePaginate);

CarSchema.index({ registrationNumber: 1 }, { unique: true });

export default (mongoose.models.Car as ReturnType<
  typeof mongoose.model<ICar, mongoose.PaginateModel<ICar>>
>) || mongoose.model<ICar, mongoose.PaginateModel<ICar>>('Car', CarSchema);
