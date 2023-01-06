import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { env } from '@/env/server.mjs';

const getServerAuthSession = async (req: NextApiRequest) => {
  const { token } = req.cookies;

  if (!token) {
    return null;
  }

  const decodedData = (jwt.verify(token, env.JWT_SECRET) as { id: string }).id;

  return decodedData;
};

export default getServerAuthSession;
