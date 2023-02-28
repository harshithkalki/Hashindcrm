import { router, protectedProcedure } from '../trpc';
import RoleModel from '@/models/Role';
import { ZRoleCreateInput, ZRoleUpdateInput } from '@/zobjs/role';
import checkPermission from '@/utils/checkPermission';
import { z } from 'zod';

export const roleRouter = router({
  create: protectedProcedure
    .input(ZRoleCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'ROLE',
        { create: true },
        ctx.clientId,
        'You are not permitted to create a role'
      );

      const role = await RoleModel.create({
        ...input,
        company: client.company,
      });

      return role;
    }),

  update: protectedProcedure
    .input(ZRoleUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'ROLE',
        { update: true },
        ctx.clientId,
        'You are not permitted to update a role'
      );

      const role = await RoleModel.findOneAndUpdate(
        { _id: input._id },
        { ...input },
        { new: true }
      );

      return role;
    }),

  delete: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'ROLE',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete a role'
      );

      const role = await RoleModel.findOneAndDelete({ _id: input._id });

      return role;
    }),

  get: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'ROLE',
        { read: true },
        ctx.clientId,
        'You are not permitted to read a role'
      );

      const role = await RoleModel.findOne({ _id: input._id });

      return role;
    }),

  roles: protectedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'ROLE',
        { read: true },
        ctx.clientId,
        'You are not permitted to read roles'
      );
      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const roles = await RoleModel.paginate(query, options);

      return roles;
    }),
});
