import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { Permissions } from '../constants/index';
import type { z } from 'zod';
import type { ZRole } from '@/zobjs/role';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IRole = ModifyDeep<
  z.infer<typeof ZRole>,
  {
    company: Types.ObjectId;
    staffMem: Types.ObjectId[];
  }
>;

type RoleModel = Model<IRole, Record<string, never>>;

const RoleSchema: Schema = new Schema<IRole, RoleModel>(
  {
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    permissions: [
      {
        permissionName: {
          type: String,
          enum: Permissions,
          required: true,
        },
        crud: {
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: false },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    displayName: { type: String, required: true },
    staffMem: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StaffMem',
      },
    ],
    defaultRedirect: { type: String, required: false },
    description: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

RoleSchema.index({ name: 1, company: 1 }, { unique: true });
RoleSchema.index(
  { 'permissions.permissionName': 1, name: 1 },
  { unique: true }
);

RoleSchema.plugin(mongoosePaginate);

export default (mongoose.models.Role as ReturnType<
  typeof mongoose.model<IRole, mongoose.PaginateModel<IRole>>
>) || mongoose.model<IRole, mongoose.PaginateModel<IRole>>('Role', RoleSchema);
