import mongoose from 'mongoose';
import { env } from '@/env/server.mjs';

mongoose.set('strictQuery', true);

declare global {
  // eslint-disable-next-line no-var
  var mongooseCli: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCli;

if (!cached) {
  cached = global.mongooseCli = { conn: null, promise: null };
}

const { MONGODB_URI } = env;

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;

  return cached.conn;
}
