import jwt from 'jsonwebtoken';

export const getJWTToken = (id: string): string =>
  jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
