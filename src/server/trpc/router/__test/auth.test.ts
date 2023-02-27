import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect } from 'vitest';
import { appRouter } from '../_app';
import { createContext, createContextInner } from '@/server/trpc/context';
import { env } from '@/env/server.mjs';
import { getJWTToken } from '@/utils/jwt';

describe('auth', async () => {
  const caller = appRouter.createCaller(
    await createContextInner({
      clientId: null,
      req: {} as NextApiRequest,
      res: {
        setHeader(name, value) {
          console.log(name, value);
        },
      } as NextApiResponse,
    })
  );

  it('staff login', async () => {
    const res = await caller.auth.login({
      email: 'test@gmail.com',
      password: 'test',
    });

    expect(res).toEqual({
      success: true,
    });
  });

  it('super admin login', async () => {
    const res = await caller.auth.login({
      email: env.SUPER_ADMIN_EMAIL,
      password: env.SUPER_ADMIN_PASSWORD,
    });

    expect(res).toEqual({
      success: true,
    });
  });

  it('staff invalid credentials', async () => {
    expect(
      caller.auth.login({
        email: 'test@gmail.com',
        password: 'test1',
      })
    ).rejects.toThrowError('Invalid credentials');
  });

  it('super admin invalid credentials', async () => {
    expect(
      caller.auth.login({
        email: env.SUPER_ADMIN_EMAIL,
        password: 'test1',
      })
    ).rejects.toThrowError('Invalid credentials');
  });

  it('should return logined staff', async () => {
    const testToken = getJWTToken(process.env.TEST_STAFF_ID as string);

    const caller = appRouter.createCaller(
      await createContext({
        req: {
          cookies: {
            token: testToken,
          },
        } as NextApiRequest & { cookies: { token: string } },
        res: {} as NextApiResponse,
      })
    );

    const res = await caller.auth.me();

    console.log(res);

    expect(res).toBeDefined();
  });

  it('should return logined super admin', async () => {
    const testToken = getJWTToken(env.SUPER_ADMIN_EMAIL);

    const caller = appRouter.createCaller(
      await createContext({
        req: {
          cookies: {
            token: testToken,
          },
        } as NextApiRequest & { cookies: { token: string } },
        res: {} as NextApiResponse,
      })
    );

    const res = await caller.auth.me();

    expect(res).toBeDefined();
  });
});
