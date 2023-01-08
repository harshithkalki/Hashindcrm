import UserModel from '@/models/userModel';
import RoleModel from '@/models/Role';
import type { Permissions } from '@/constants';

const checkPermission = async (
  clientId: string,
  access: typeof Permissions[number],
  curd: 'create' | 'read' | 'update' | 'delete'
) => {
  const client = await UserModel.findById(clientId);
  if (!client) {
    return false;
  }

  const role = await RoleModel.findById(client.role);

  const permission = role?.permissions.find(
    (permission) => permission.permissionName === access
  );

  if (!permission) {
    return false;
  }

  if (permission.crud[curd]) {
    return client;
  }
};

export default checkPermission;
