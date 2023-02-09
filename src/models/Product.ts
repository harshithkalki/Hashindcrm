import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { BrandDocument } from './Brand';
import type { CategoryDocument } from './Category';
import type { CompanyDocument } from './Company';
import type { WarehouseDocument } from './Warehouse';

export interface IProduct {
  name: string;
  slug: string;
  logo?: string;
  quantity: number;
  quantityAlert: number;
  category: Types.ObjectId | CategoryDocument;
  brand: Types.ObjectId | BrandDocument;
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
  warehouse: Types.ObjectId | WarehouseDocument;
  companyId: Types.ObjectId | CompanyDocument;
}

export type ProductDocument = mongoose.Document & IProduct;

type ProductModel = Model<ProductDocument, Record<string, never>>;

const ProductSchema: Schema = new Schema<ProductDocument, ProductModel>(
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

ProductSchema.plugin(mongoosePaginate);

ProductSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Product as ReturnType<
  typeof mongoose.model<
    ProductDocument,
    mongoose.PaginateModel<ProductDocument>
  >
>) ||
  mongoose.model<ProductDocument, mongoose.PaginateModel<ProductDocument>>(
    'Product',
    ProductSchema
  );
