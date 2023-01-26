import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Category {
  name: string;
  slug: string;
  logo: string;
  parentCategory?: ObjectId;
  companyId: ObjectId;
}

type CategoryModel = Model<Category, Record<string, never>>;

const CategorySchema: Schema = new Schema<Category, CategoryModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String, required: true },
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
  typeof mongoose.model<Category, CategoryModel>
>) || mongoose.model<Category, CategoryModel>('Category', CategorySchema);
