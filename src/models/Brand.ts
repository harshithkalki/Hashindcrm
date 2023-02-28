import type { ZBrand } from '@/zobjs/brand';
import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { z } from 'zod';

export type IBrand = ModifyDeep<
  z.infer<typeof ZBrand>,
  {
    company: mongoose.Types.ObjectId;
  }
>;

export type BrandDocument = mongoose.Document & IBrand;

type BrandModel = Model<IBrand, Record<string, never>>;

const BrandSchema: Schema = new Schema<IBrand, BrandModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
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
