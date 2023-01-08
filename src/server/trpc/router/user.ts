import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import UserModel from '@/models/userModel';
import RoleModel from '@/models/Role';
import CompanyModel from '@/models/Company';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import { Permissions } from '@/constants';

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
    ctx.res.setHeader(
      'Set-Cookie',
      `token
      =; expires=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      ; httpOnly; path=/`
    );
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await UserModel.findById(ctx.userId);
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isPermitted = await checkPermission(ctx.userId, 'ROLE', 'create');

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a role',
        });
      }

      const role = await RoleModel.create({
        ...input,
        company: '63baa7fc8b6686fcb2b2f057',
      });

      return role;
    }),

  addPermission: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        permissionName: z.enum(Permissions),
        crud: z.object({
          create: z.boolean().optional(),
          read: z.boolean().optional(),
          update: z.boolean().optional(),
          delete: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isPermitted = await checkPermission(ctx.userId, 'ROLE', 'update');

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a role',
        });
      }

      const role = await RoleModel.findById(input.roleId);

      role?.permissions.push({
        permissionName: input.permissionName,
        crud: input.crud,
      });

      await role?.save();

      return role;
    }),

  createCompany: protectedProcedure
    .input(
      z.object({
        companyName: z.string(),
        addressLine1: z.string(),
        addressLine2: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
        country: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const isPermitted = await checkPermission(
        ctx.userId,
        'COMPANY',
        'create'
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a company',
        });
      }

      const company = await CompanyModel.create({
        ...input,
        owner: ctx.userId,
      });

      return company;
    }),

  register: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        middleName: z.string().optional(),
        lastName: z.string(),
        phoneNumber: z.string(),
        addressLine1: z.string(),
        addressLine2: z.string(),
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
      const isPermitted = await checkPermission(ctx.userId, 'USER', 'create');

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a user',
        });
      }

      const user = await UserModel.create({
        ...input,
        companyId: isPermitted.companyId,
        password: '123456',
      });

      await RoleModel.updateOne(
        { _id: input.role },
        { $push: { users: user._id } }
      );

      return user;
    }),
});
