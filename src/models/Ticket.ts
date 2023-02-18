import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { IUser } from '@/models/User';

export interface ITicket {
  name: string;
  createdAt: Date;
  companyId: Types.ObjectId;
  assignedTo?: Types.ObjectId | (IUser & { _id: string });
  status: Types.ObjectId;
}

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
      ref: 'Ticket',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { versionKey: false }
);

TicketSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Ticket as ReturnType<
  typeof mongoose.model<ITicket, TicketModel>
>) || mongoose.model<ITicket, TicketModel>('Ticket', TicketSchema);
