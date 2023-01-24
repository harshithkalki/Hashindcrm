import RoleModel from '@/models/Role';
import type { Permissions } from '@/constants';
import type { User } from '@/models/User';

const checkPermission = async (
  access: typeof Permissions[number],
  curd: 'create' | 'read' | 'update' | 'delete',
  client: User,
  checkAny?: boolean
) => {
  const role = await RoleModel.findById(client.role);

  const permission = role?.permissions.find((p) => p.permissionName === access);

  if (!permission) {
    return false;
  }

  if (checkAny) {
    return (
      permission.crud.create ||
      permission.crud.delete ||
      permission.crud.update ||
      permission.crud.read
    );
  }

  return permission.crud[curd];
};

export default checkPermission;
