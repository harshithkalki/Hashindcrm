import type { Model, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { ITicket } from './Ticket';
import type { IRole } from './Role';

export interface IStaffMem {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: Types.ObjectId | IRole;
  linkedTo?: Types.ObjectId;
  companyId: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  ticket?: Types.ObjectId | (ITicket & { _id: string });
}

interface StaffMemMethods {
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
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    addressline1: { type: String, required: true },
    addressline2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    linkedTo: { type: Schema.Types.ObjectId, ref: 'StaffMem' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
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

export default (mongoose.models.StaffMem as ReturnType<
  typeof mongoose.model<IStaffMem, StaffMemModel>
>) || mongoose.model<IStaffMem, StaffMemModel>('StaffMem', StaffMemSchema);
