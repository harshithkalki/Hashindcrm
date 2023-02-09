import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  logo: string;
  parentCategory?: Types.ObjectId;
  companyId: Types.ObjectId;
}

type CategoryModel = Model<ICategory, Record<string, never>>;
export type CategoryDocument = mongoose.Document & ICategory;

const CategorySchema: Schema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String, required: false },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

CategorySchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Category as ReturnType<
  typeof mongoose.model<ICategory, CategoryModel>
>) || mongoose.model<ICategory, CategoryModel>('Category', CategorySchema);
