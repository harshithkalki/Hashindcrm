import type { Model } from 'mongoose';
import { Schema } from 'mongoose';
import mongoose from 'mongoose';

export type ICount = {
  count: number;
  company: mongoose.Types.ObjectId;
  name: 'invoice' | 'purchase';
};

type CountModel = Model<ICount, Record<string, never>>;

const CountSchema: Schema = new Schema<ICount, CountModel>(
  {
    count: { type: Number, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

CountSchema.index({ company: 1, name: 1 }, { unique: true });

export default (mongoose.models.Count as ReturnType<
  typeof mongoose.model<ICount, mongoose.PaginateModel<ICount>>
>) ||
  mongoose.model<ICount, mongoose.PaginateModel<ICount>>('Count', CountSchema);
