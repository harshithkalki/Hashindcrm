import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { z } from 'zod';
import type { ZStaffMem } from '@/zobjs/staffMem';
import mongoosePaginate from 'mongoose-paginate-v2';

export type IStaffMem = ModifyDeep<
  z.infer<typeof ZStaffMem>,
  {
    role: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    ticket?: mongoose.Types.ObjectId;
    linkedTo?: mongoose.Types.ObjectId;
    createdAt: Date;
    warehouse: mongoose.Types.ObjectId;
  }
>;

export interface StaffMemMethods {
  getJWTToken(): string;
  comparePassword(password: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

export type StaffMemDocument = IStaffMem & mongoose.Document;

type StaffMemModel = Model<IStaffMem, Record<string, never>, StaffMemMethods>;

const StaffMemSchema: Schema = new Schema<
  IStaffMem,
  StaffMemModel,
  StaffMemMethods
>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    linkedTo: { type: Schema.Types.ObjectId, ref: 'StaffMem' },
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    profile: { type: String, required: false },
    status: { type: String, required: true },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  },
  {
    versionKey: false,
  }
);

StaffMemSchema.pre('save', async function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

StaffMemSchema.method('getJWTToken', function getJWTToken() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
});

StaffMemSchema.method(
  'comparePassword',
  async function comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
);

StaffMemSchema.method(
  'getResetPasswordToken',
  function getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
  }
);

StaffMemSchema.plugin(mongoosePaginate);

export default (mongoose.models.StaffMem as ReturnType<
  typeof mongoose.model<
    IStaffMem,
    mongoose.PaginateModel<IStaffMem, Record<string, never>, StaffMemMethods>
  >
>) ||
  mongoose.model<
    IStaffMem,
    mongoose.PaginateModel<IStaffMem, Record<string, never>, StaffMemMethods>
  >('StaffMem', StaffMemSchema);
