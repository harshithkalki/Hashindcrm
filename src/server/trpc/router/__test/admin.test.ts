import { describe, it, expect } from 'vitest';
import { appRouter } from '@/server/trpc/router/_app';
import { createContextInner } from '../../context';
import { env } from '@/env/server.mjs';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('adminRouter', async () => {
  const caller = appRouter.createCaller(
    await createContextInner({
      clientId: env.SUPER_ADMIN_EMAIL,
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
    })
  );

  it('should create admin', async () => {
    const data = {
      firstName: 'kalki',
      lastName: 'harshith',
      phoneNumber: '123456',
      addressline1: 'hahah',
      city: 'hyd',
      state: 'tel',
      country: 'ind',
      pincode: '212345',
      email: 'harshith@gmail.com',
      password: '123456',
      company: '63ff1a39b29440e57af4c524',
    };

    const admin = await (await caller.staffRouter.createAdmin(data)).toObject();

    const { password: _, ...rest } = data;

    expect(admin).toMatchObject(rest);
  });
});
