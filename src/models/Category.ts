import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Category {
  name: string;
  slug: string;
  logo: string;
  children?: string[];
  companyId: ObjectId;
}

type CategoryModel = Model<Category, Record<string, never>>;

const CategorySchema: Schema = new Schema<Category, CategoryModel>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    logo: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

export default (mongoose.models.Category as ReturnType<
  typeof mongoose.model<Category, CategoryModel>
>) || mongoose.model<Category, CategoryModel>('Category', CategorySchema);
