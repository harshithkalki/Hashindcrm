import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import StaffModel from '@/models/StaffMem';
import RoleModel from '@/models/Role';
import checkPermission from '@/utils/checkPermission';
import {
  ZAdminCreateInput,
  ZAdminUpdateInput,
  ZStaffMemCreateInput,
  ZStaffMemUpdateInput,
} from '@/zobjs/staffMem';
import { env } from '@/env/server.mjs';
import { TRPCError } from '@trpc/server';
import { Permissions, Roles } from '@/constants';

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

export const staffRouter = router({
  create: protectedProcedure
    .input(ZStaffMemCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STAFFMEM',
        { create: true },
        ctx.clientId,
        'You are not permitted to create a staff'
      );

      const staff = await StaffModel.create({
        ...input,
        company: client.company,
        password: '123456',
      });

      await RoleModel.updateOne(
        { _id: input.role },
        { $push: { staffMem: staff._id } }
      );

      return staff;
    }),

  getAllStaffs: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'STAFFMEM',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read staff'
    );

    const staffs = await StaffModel.find({ company: client.company });

    return staffs;
  }),

  getAllStaffsNames: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'STAFFMEM',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read staff'
    );

    const staffs = await StaffModel.find({ company: client.company })
      .select('firstName middleName lastName')
      .lean();

    return staffs.map((val) => {
      return {
        _id: val._id.toString(),
        name: val.name,
      };
    });
  }),

  update: protectedProcedure
    .input(ZStaffMemUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'STAFFMEM',
        { update: true },
        ctx.clientId,
        'You are not permitted to update a staff'
      );

      const staff = await StaffModel.findOneAndUpdate(
        { _id: input._id },
        { ...input },
        { new: true }
      );

      return staff;
    }),

  staffs: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STAFFMEM',
        { read: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
      );

      const { cursor: page = 1, limit = 10, search } = input || {};

      const options = {
        page: page ?? undefined,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const staffs = await StaffModel.paginate(query, options);

      return staffs;
    }),

  createAdmin: protectedProcedure
    .input(ZAdminCreateInput)
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to create admin',
        });
      }

      const admin = new StaffModel({
        ...input,
      });

      const role = await RoleModel.findOne({ name: Roles[0] });

      if (!role) {
        const newRole = await RoleModel.create({
          name: Roles[0],
          displayName: 'Admin',
          company: input.company,
          staffMem: [admin._id],
          permissions: Permissions.map((permission) => ({
            permissionName: permission,
            crud: {
              create: true,
              read: true,
              update: true,
              delete: true,
            },
          })),
          defaultRedirect: '/dashboard',
        });
        admin.role = newRole._id;
        await admin.save();

        return admin;
      }

      admin.role = role._id;

      await admin.save();

      await RoleModel.updateOne(
        { _id: role._id },
        { $push: { staffMem: admin._id } }
      );

      return admin;
    }),

  updateAdmin: protectedProcedure
    .input(ZAdminUpdateInput)
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to update admin',
        });
      }

      delete input.password;

      await StaffModel.updateOne(
        { _id: input._id },
        {
          ...input,
        }
      );

      return true;
    }),

  deleteAdmin: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to delete admin',
        });
      }

      const staff = await StaffModel.findByIdAndDelete(input._id);

      const role = await RoleModel.findOne({
        name: Roles[0],
        company: staff?.company,
      });

      if (role) {
        await RoleModel.updateOne(
          { _id: role._id },
          { $pull: { staffMem: staff?._id } }
        );
      }

      return true;
    }),

  getAdmins: protectedProcedure
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
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to read admin',
        });
      }

      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
      };

      const query = {
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const admins = await StaffModel.paginate(query, options);

      return {
        ...admins,
        docs: admins.docs.map((admin) => ({
          ...admin.toObject(),
          _id: admin._id.toString(),
        })),
      };
    }),

  getStaff: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STAFFMEM',
        { read: true },
        ctx.clientId,
        'You are not permitted to read staff'
      );

      const staff = await StaffModel.findOne({
        _id: input._id,
        company: client.company,
      });

      const { password, ...rest } = staff?.toObject() ?? {};

      return rest;
    }),

  getAdmin: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to read admin',
        });
      }

      const admin = await StaffModel.findOne({
        _id: input._id,
      });

      return admin;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'STAFFMEM',
        {
          delete: true,
        },
        ctx.clientId,
        'You are not permitted to delete staff'
      );

      const staff = await StaffModel.findByIdAndDelete(input._id);

      return staff;
    }),
});
