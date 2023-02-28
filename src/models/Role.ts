import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { Permissions } from '../constants/index';
import type { z } from 'zod';
import type { ZRole } from '@/zobjs/role';

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

export default (mongoose.models.Role as ReturnType<
  typeof mongoose.model<IRole, RoleModel>
>) || mongoose.model<IRole, RoleModel>('Role', RoleSchema);
