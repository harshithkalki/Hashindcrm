import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { ITicket as IZTicket } from '@/zobjs/ticket';


type ITicket = Omit<IZTicket, "assignedTo" | "companyId" | "status"> & {
  _id: Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  status: mongoose.Types.ObjectId;
};

type TicketModel = Model<ITicket, Record<string, never>>;

export type TicketDocument = ITicket & mongoose.Document;

const TicketSchema = new Schema<ITicket, TicketModel>(
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
    status: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Status',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    issueType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    files: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
  },
  { versionKey: false }
);

TicketSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Ticket as ReturnType<
  typeof mongoose.model<ITicket, TicketModel>
>) || mongoose.model<ITicket, TicketModel>('Ticket', TicketSchema);
