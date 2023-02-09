import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface Ticket {
  name: string;
  createdAt: Date;
  companyId: Types.ObjectId;
  status: Types.ObjectId;
}

type TicketModel = Model<Ticket, Record<string, never>>;

const TicketSchema = new Schema<Ticket, TicketModel>(
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
  },
  { versionKey: false }
);

TicketSchema.index({ name: 1, companyId: 1 }, { unique: true });

export default (mongoose.models.Ticket as ReturnType<
  typeof mongoose.model<Ticket, TicketModel>
>) || mongoose.model<Ticket, TicketModel>('Ticket', TicketSchema);
