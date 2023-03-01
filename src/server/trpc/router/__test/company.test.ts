import { describe, it, expect } from 'vitest';
import { appRouter } from '@/server/trpc/router/_app';
import { createContextInner } from '../../context';
import { env } from '@/env/server.mjs';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('companyRouter', async () => {
  const caller = appRouter.createCaller(
    await createContextInner({
      clientId: env.SUPER_ADMIN_EMAIL,
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
    })
  );
});
