import { test, expect } from 'vitest';
import { appRouter } from '../_app';
import { createContextInner } from '../../context';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { IStaffMem } from '@/models/StaffMem';
import User from '@/models/StaffMem';
import { Types } from 'mongoose';
import type { IRole } from '@/models/Role';

test('getAll test', async () => {
  const mockUser: IStaffMem & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    firstName: 'test',
    middleName: 'test',
    lastName: 'test',
    email: 'test@gmail.com',
    password: 'test',
    addressline1: 'test',
    addressline2: 'test',
    city: 'test',
    state: 'test',
    country: 'test',
    pincode: 'test',
    createdAt: new Date(),
    role: {
      company: new Types.ObjectId(),
      createdAt: new Date(),
      name: 'test',
      permissions: [
        {
          crud: {
            read: true,
          },
          permissionName: 'BRAND',
        },
      ],
      displayName: 'test',
      users: [],
    } as IRole,
    companyId: new Types.ObjectId(),
    phoneNumber: 'test',
  };

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
