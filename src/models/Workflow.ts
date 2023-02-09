import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface Workflow {
  name: string;
  companyId: Types.ObjectId;
  links: Types.ObjectId[];
  createdAt: Date;
}

type WorkflowModel = Model<Workflow, Record<string, never>>;

const WorkflowSchema = new Schema<Workflow, WorkflowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default (mongoose.models.Workflow as ReturnType<
  typeof mongoose.model<Workflow, WorkflowModel>
>) || mongoose.model<Workflow, WorkflowModel>('Workflow', WorkflowSchema);
