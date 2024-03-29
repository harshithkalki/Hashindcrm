import type { ZCompany } from '@/zobjs/company';
import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { z } from 'zod';

export type ICompany = z.infer<typeof ZCompany>;

export type CompanyDocument = mongoose.Document & ICompany;

type CompanyModel = Model<ICompany, Record<string, never>>;

const CompanySchema: Schema = new Schema<ICompany, CompanyModel>(
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
    primaryColor: { type: String, required: false },
    secondaryColor: { type: String, required: false },
    backgroundColor: { type: String, required: false },
    logo: { type: String, required: false },
    natureOfBusiness: { type: String, required: true },
    email: { type: String, required: true },
    numbers: [
      {
        type: String,
        required: true,
      },
    ],
    pan: { type: String, required: false },
    domain: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

CompanySchema.plugin(mongoosePaginate);

CompanySchema.index({
  domain: 1,
});

export default (mongoose.models.Company as ReturnType<
  typeof mongoose.model<ICompany, mongoose.PaginateModel<ICompany>>
>) ||
  mongoose.model<ICompany, mongoose.PaginateModel<ICompany>>(
    'Company',
    CompanySchema
  );
