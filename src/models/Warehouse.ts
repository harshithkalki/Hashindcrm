import type { Model, ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface Warehouse {
  name: string;
  companyId: ObjectId;
}

type WarehouseModel = Model<Warehouse, Record<string, never>>;

const WarehouseSchema: Schema = new Schema<Warehouse, WarehouseModel>(
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
  typeof mongoose.model<Warehouse, WarehouseModel>
>) || mongoose.model<Warehouse, WarehouseModel>('Warehouse', WarehouseSchema);
