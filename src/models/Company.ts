import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Company {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: Date;
}

type CompanyModel = Model<Company, Record<string, never>>;

const CompanySchema: Schema = new Schema<Company, CompanyModel>(
  {
    companyName: { type: String, required: true, unique: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.Company as ReturnType<
  typeof mongoose.model<Company, CompanyModel>
>) || mongoose.model<Company, CompanyModel>('Company', CompanySchema);
