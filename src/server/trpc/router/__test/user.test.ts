import { test, expect } from '@jest/globals';
import { appRouter } from '../_app';
import { createContextInner } from '../../context';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { IStaffMem } from '@/models/StaffMem';
import User from '@/models/StaffMem';
import { Types } from 'mongoose';
import type { IRole } from '@/models/Role';

test('', async () => {
  const caller = appRouter.createCaller(
    await createContextInner({
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
      userId: mockUser._id.toString(),
    })
  );

  const result = await caller.brandRouter.brands();

  console.log(result);
});
