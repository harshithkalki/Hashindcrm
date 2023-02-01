import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Product {
  name: string;
  slug: string;
  logo?: string;
  quantity: number;
  quantityAlert: number;
  category: ObjectId;
  brand: ObjectId;
  barcodeSymbology: string;
  itemCode: string;
  openingStock: number;
  openingStockDate: Date;
  purchasePrice: number;
  salePrice: number;
  tax: number;
  mrp: number;
  expiryDate?: Date;
  description?: string;
  warehouse: ObjectId;
  companyId: ObjectId;
}

type ProductModel = Model<Product, Record<string, never>>;

const ProductSchema: Schema = new Schema<Product, ProductModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String },
    quantity: { type: Number, required: true },
    quantityAlert: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    barcodeSymbology: { type: String, required: true },
    itemCode: { type: String, required: true },
    openingStock: { type: Number, required: true },
    openingStockDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    mrp: { type: Number, required: true },
    expiryDate: { type: Date },
    description: { type: String },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

ProductSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Product as ReturnType<
  typeof mongoose.model<Product, ProductModel>
>) || mongoose.model<Product, ProductModel>('Product', ProductSchema);
