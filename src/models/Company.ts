import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface CompanyCreateInput {
  name: string;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landline: string;
  mobile: string;
  gstNo: string;
  cinNo: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  logo: string;
}

export interface CompanyUpdateInput
  extends Partial<CompanyCreateInput>,
    DocWithId {}

export interface ICompany extends CompanyCreateInput {
  createdAt: Date;
}

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
    landline: { type: String, required: true },
    mobile: { type: String, required: true },
    gstNo: { type: String, required: true },
    cinNo: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    logo: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

CompanySchema.plugin(mongoosePaginate);

export default (mongoose.models.Company as ReturnType<
  typeof mongoose.model<ICompany, mongoose.PaginateModel<ICompany>>
>) ||
  mongoose.model<ICompany, mongoose.PaginateModel<ICompany>>(
    'Company',
    CompanySchema
  );
