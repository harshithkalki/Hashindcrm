import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface Link {
  target: mongoose.ObjectId;
  linkedStatus: mongoose.ObjectId[];
  workflowId: mongoose.ObjectId;
  createdAt: Date;
}

type LinkModel = Model<Link, Record<string, never>>;

const LinkSchema = new Schema<Link, LinkModel>(
  {
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Status',
    },
    linkedStatus: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
    workflowId: {
      type: Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
  },
  { versionKey: false }
);

LinkSchema.index({ workflowId: 1, target: 1 }, { unique: true });

export default (mongoose.models.Link as ReturnType<
  typeof mongoose.model<Link, LinkModel>
>) || mongoose.model<Link, LinkModel>('Link', LinkSchema);
