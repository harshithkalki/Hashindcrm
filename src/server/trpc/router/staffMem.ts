import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import StaffModel from '@/models/StaffMem';
import RoleModel from '@/models/Role';
import checkPermission from '@/utils/checkPermission';
import { ZStaffMemCreateInput, ZStaffMemUpdateInput } from '@/zobjs/staffMem';

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
        name: `${val.firstName} ${val.middleName} ${val.lastName}`,
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
        'STAFFMEM',
        { read: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
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

      const staffs = await StaffModel.paginate(query, options);

      return staffs;
    }),
});
