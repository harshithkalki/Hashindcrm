import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { Permissions } from '@/constants/index';

export interface Role {
  name: string;
  createdAt: Date;
  permissions: {
    permissionName: typeof Permissions[number];
    crud: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
  }[];
  displayName: string;
  company: mongoose.ObjectId;
  users: mongoose.ObjectId[];
}

type RoleModel = Model<Role, Record<string, never>>;

const RoleSchema: Schema = new Schema<Role, RoleModel>(
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
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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
  typeof mongoose.model<Role, RoleModel>
>) || mongoose.model<Role, RoleModel>('Role', RoleSchema);
