import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Brand {
  name: string;
  slug: string;
  logo: string;
  companyId: ObjectId;
}

type BrandModel = Model<Brand, Record<string, never>>;

const BrandSchema: Schema = new Schema<Brand, BrandModel>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    logo: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.Brand as ReturnType<
  typeof mongoose.model<Brand, BrandModel>
>) || mongoose.model<Brand, BrandModel>('Brand', BrandSchema);
