import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import UserModel from '@/models/StaffMem';
import type { IRole } from '@/models/Role';
import RoleModel from '@/models/Role';
import CompanyModel from '@/models/Company';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import { Permissions } from '@/constants';

interface StatusType {
  id: string;
  name: string;
  linkedStatuses: StatusType[];
}

const Status: z.ZodType<StatusType> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    linkedStatuses: z.array(Status),
  })
);

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await UserModel.findOne({ email: input.email });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const isMatch = await user.comparePassword(input.password);

      if (!isMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const token = user.getJWTToken();

      ctx.res.setHeader(
        'Set-Cookie',
        `token=${token}; expires=${new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        )}; httpOnly; path=/`
      );

      return {
        success: true,
      };
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', `token=; expires=${new Date()}; path=/`);
    return {
      success: true,
    };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await UserModel.findById(ctx.clientId)
      .populate<{
        role: {
          _id: string;
        } & IRole;
      }>('role', 'name')
      .lean();

    return user;
  }),

  createRole: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        displayName: z.string(),
        description: z.string(),
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
        defaultRedirect: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'ROLE',
        { create: true },
        ctx.clientId,
        'You are not permitted to create a role'
      );

      const role = await RoleModel.create({
        ...input,
        company: client.companyId,
      });

      return role;
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        displayName: z.string(),
        description: z.string(),
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'ROLE',
        { update: true },
        ctx.clientId,
        'You are not permitted to update a role'
      );

      await RoleModel.findByIdAndUpdate(input.id, input);
    }),

  getRole: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'ROLE',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read a role'
      );

      return RoleModel.findOne({
        _id: input.roleId,
      }).lean();
    }),

  createUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        middlename: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
        addressline1: z.string(),
        addressline2: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        pincode: z.string(),
        role: z.string(),
        linkedTo: z.string().optional(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'USER',
        { create: true },
        ctx.clientId,
        'You are not permitted to create a user'
      );

      const user = await UserModel.create({
        ...input,
        companyId: client.companyId,
        password: '123456',
      });

      await RoleModel.updateOne(
        { _id: input.role },
        { $push: { users: user._id } }
      );

      return user;
    }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'USER',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read users'
    );

    const users = await UserModel.find({ companyId: client.companyId });

    return users;
  }),

  getAllUsersNames: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'USER',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read users'
    );

    const users = await UserModel.find({ companyId: client.companyId })
      .select('firstName middleName lastName')
      .lean();

    return users.map((val) => {
      return {
        _id: val._id.toString(),
        name: `${val.firstName} ${val.middleName} ${val.lastName}`,
      };
    });
  }),

  getAllRoles: protectedProcedure.query(async ({ ctx }) => {
    await checkPermission(
      'ROLE',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read roles'
    );

    return (await RoleModel.find()).map((val) => {
      return {
        ...val.toObject(),
        id: val._id.toHexString(),
      };
    });
  }),
});
