import { z } from 'zod';
import { Permissions } from '../constants/index';

export const ZRoleCreateInput = z.object({
  name: z.string(),
  permissions: z.array(
    z.object({
      permissionName: z.enum(Permissions),
      crud: z.object({
        create: z.boolean().optional(),
        read: z.boolean().optional(),
        update: z.boolean().optional(),
        delete: z.boolean().optional(),
      }),
    })
  ),
  displayName: z.string(),
  defaultRedirect: z.string().optional(),
  description: z.string().optional(),
});

export const ZRoleUpdateInput = ZRoleCreateInput.partial().extend({
  _id: z.string(),
});

export const ZRole = ZRoleCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
  staffMem: z.string(),
});
