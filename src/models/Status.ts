import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface Status {
  name: string;
  createdAt: Date;
  companyId: mongoose.ObjectId;
  initialStatus: boolean;
  linkedStatuses: string[];
}

type StatusModel = Model<Status, Record<string, never>>;

const StatusSchema = new Schema<Status, StatusModel>(
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
    companyId: {
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
  typeof mongoose.model<Status, StatusModel>
>) || mongoose.model<Status, StatusModel>('Status', StatusSchema);
