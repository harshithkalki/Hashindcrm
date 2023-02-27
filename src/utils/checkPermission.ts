import type { IRole } from '@/models/Role';
import StaffMemModel from '@/models/StaffMem';
import type { Permissions } from '@/constants';
import { TRPCError } from '@trpc/server';

const checkPermission = async (
  permission: typeof Permissions[number],
  curd: {
    create?: boolean;
    delete?: boolean;
    update?: boolean;
    read?: boolean;
  },
  clientId: string,
  errorMessage: string
) => {
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

  return client;
};

export default checkPermission;
