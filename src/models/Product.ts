import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import type { IBrand } from './Brand';
import type { ICategory } from './Category';
import type { ICompany } from './Company';
import type { IWarehouse } from './Warehouse';

export interface ProductCreateInput {
  name: string;
  slug: string;
  logo?: string;
  quantity: number;
  quantityAlert: number;
  category: string;
  brand: string;
  barcodeSymbology: string;
  itemCode: string;
  openingStock: number;
  openingStockDate: string;
  purchasePrice: number;
  salePrice: number;
  tax: number;
  mrp: number;
  expiryDate?: string;
  description?: string;
  warehouse: string;
}

export interface ProductUpdateInput
  extends Partial<ProductCreateInput>,
    DocWithId {}

export interface IProduct
  extends ModifyDeep<
    ProductCreateInput,
    {
      category: Types.ObjectId | (ICategory & DocWithId) | null;
      brand: Types.ObjectId | (IBrand & DocWithId) | null;
      warehouse: Types.ObjectId | (IWarehouse & DocWithId) | null;
      company: Types.ObjectId | (ICompany & DocWithId) | null;
      openingStockDate: Date;
    }
  > {
  createdAt: Date;
}

export type ProductDocument = mongoose.Document & IProduct;

type ProductModel = Model<IProduct, Record<string, never>>;

const ProductSchema: Schema = new Schema<IProduct, ProductModel>(
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
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

ProductSchema.plugin(mongoosePaginate);

ProductSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Product as ReturnType<
  typeof mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>
>) ||
  mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>(
    'Product',
    ProductSchema
  );
