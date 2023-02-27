import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IBrand {
  name: string;
  slug: string;
  logo: string;
  companyId: Types.ObjectId;
}

export type BrandDocument = mongoose.Document & IBrand;

type BrandModel = Model<IBrand, Record<string, never>>;

const BrandSchema: Schema = new Schema<IBrand, BrandModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

BrandSchema.plugin(mongoosePaginate);

BrandSchema.index({ name: 1, companyId: 1 }, { unique: true });
BrandSchema.index({ slug: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Brand as ReturnType<
  typeof mongoose.model<IBrand, mongoose.PaginateModel<IBrand>>
>) ||
  mongoose.model<IBrand, mongoose.PaginateModel<IBrand>>('Brand', BrandSchema);
