import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface StatusCreateInput {
  name: string;
  initialStatus: boolean;
  linkedStatuses: string[];
}

export interface StatusUpdateInput
  extends Partial<StatusCreateInput>,
    DocWithId {}

interface IStatus extends StatusCreateInput {
  createdAt: Date;
  company: Types.ObjectId;
}

type StatusModel = Model<IStatus, Record<string, never>>;

const StatusSchema = new Schema<IStatus, StatusModel>(
  {
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    initialStatus: {
      type: Boolean,
      required: true,
    },
    linkedStatuses: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
  },
  { versionKey: false }
);

StatusSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Status as ReturnType<
  typeof mongoose.model<IStatus, StatusModel>
>) || mongoose.model<IStatus, StatusModel>('Status', StatusSchema);
