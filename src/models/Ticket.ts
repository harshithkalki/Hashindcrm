import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { ITicket as IZTicket } from '@/zobjs/ticket';
import mongoosePaginate from 'mongoose-paginate-v2';


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
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        default: [],
      },
    ],
  },
  { versionKey: false }
);


TicketSchema.plugin(mongoosePaginate);

export default (mongoose.models.Ticket as ReturnType<
  typeof mongoose.model<ITicket, mongoose.PaginateModel<ITicket>>
>) ||
  mongoose.model<ITicket, mongoose.PaginateModel<ITicket>>(
    'Ticket',
    TicketSchema
  );
