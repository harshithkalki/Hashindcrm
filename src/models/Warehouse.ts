import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { z } from 'zod';
import type { ZWarehouse } from '@/zobjs/warehouse';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IWarehouse = ModifyDeep<
  z.infer<typeof ZWarehouse>,
  {
    company: Types.ObjectId;
  }
>;

type WarehouseModel = Model<IWarehouse, Record<string, never>>;

export type WarehouseDocument = mongoose.Document & IWarehouse;

const WarehouseSchema: Schema = new Schema<IWarehouse, WarehouseModel>(
  {
    name: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

WarehouseSchema.index({ name: 1, companyId: 1 }, { unique: true });

WarehouseSchema.plugin(mongoosePaginate);

export default (mongoose.models.Warehouse as ReturnType<
  typeof mongoose.model<IWarehouse, mongoose.PaginateModel<IWarehouse>>
>) ||
  mongoose.model<IWarehouse, mongoose.PaginateModel<IWarehouse>>(
    'Warehouse',
    WarehouseSchema
  );
