import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '@/env/server.mjs';

export interface User {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: mongoose.ObjectId;
  linkedTo?: mongoose.ObjectId;
  companyId: mongoose.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
}

interface UserMethods {
  getJWTToken(): string;
  comparePassword(password: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

type UserModel = Model<User, Record<string, never>, UserMethods>;

const UserSchema: Schema = new Schema<User, UserModel, UserMethods>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    linkedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    versionKey: false,
  }
);

UserSchema.pre('save', async function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.method('getJWTToken', function getJWTToken() {
  return jwt.sign({ id: this._id }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRE,
  });
});

UserSchema.method(
  'comparePassword',
  async function comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
);

UserSchema.method('getResetPasswordToken', function getResetPasswordToken() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
});

export default (mongoose.models.User as ReturnType<
  typeof mongoose.model<User, UserModel>
>) || mongoose.model<User, UserModel>('User', UserSchema);
