import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IWarehouse {
  name: string;
  companyId: Types.ObjectId;
}

type WarehouseModel = Model<IWarehouse, Record<string, never>>;

export type WarehouseDocument = mongoose.Document & IWarehouse;

const WarehouseSchema: Schema = new Schema<IWarehouse, WarehouseModel>(
  {
    name: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

WarehouseSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Warehouse as ReturnType<
  typeof mongoose.model<IWarehouse, WarehouseModel>
>) || mongoose.model<IWarehouse, WarehouseModel>('Warehouse', WarehouseSchema);
