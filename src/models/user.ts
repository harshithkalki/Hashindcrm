import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '@/env/server.mjs';

export interface User {
  name: string;
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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
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
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
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
