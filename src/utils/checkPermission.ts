import type { IRole } from '@/models/Role';
import type { IStaffMem, StaffMemMethods } from '@/models/StaffMem';
import StaffMemModel from '@/models/StaffMem';
import type { Permissions } from '@/constants';
import { TRPCError } from '@trpc/server';
import { env } from '@/env/server.mjs';
import type { Types } from 'mongoose';
import type { Document } from 'mongoose';

type Client = Omit<
  Document<unknown, any, IStaffMem> &
    IStaffMem & {
      _id: Types.ObjectId;
    } & StaffMemMethods,
  'role'
> & {
  role: IRole & {
    _id: string;
  };
};

type SuperAdmin = 'super-admin';

const checkPermission = async <T extends typeof Permissions[number]>(
  permission: T,
  curd: {
    create?: boolean;
    delete?: boolean;
    update?: boolean;
    read?: boolean;
  },
  clientId: string,
  errorMessage: string
): Promise<T extends 'COMPANY' ? SuperAdmin : Client> => {
  if (clientId === env.SUPER_ADMIN_EMAIL) {
    if (permission === 'COMPANY') {
      return 'super-admin' as T extends 'COMPANY' ? 'super-admin' : Client;
    } else {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Super admin can only access company resources',
      });
    }
  }

  const client = await StaffMemModel.findById(clientId).populate<{
    role: IRole & { _id: string };
  }>('role');

  if (!client) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please login to access this resource',
    });
  }

  const isPermitted = Object.entries(
    client.role.permissions.find((p) => p.permissionName === permission)
      ?.crud || {}
  ).some(([key, value]) => {
    if (key === 'create') {
      return value && curd.create;
    }
    if (key === 'delete') {
      return value && curd.delete;
    }
    if (key === 'update') {
      return value && curd.update;
    }
    if (key === 'read') {
      return value && curd.read;
    }

    return false;
  });

  if (!isPermitted) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: errorMessage,
    });
  }

  return client as T extends 'COMPANY' ? 'super-admin' : Client;
};

export default checkPermission;
