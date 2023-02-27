import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CompanyModel from '@/models/Company';
import checkPermission from '@/utils/checkPermission';

export const companyRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        addressline1: z.string(),
        addressline2: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
        country: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        backgroundColor: z.string(),
        logo: z.string(),
        gstNo: z.string(),
        cinNo: z.string(),
        landline: z.string(),
        mobile: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'COMPANY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create company'
      );

      const company = await CompanyModel.create({
        ...input,
        companyId: client.company,
      });

      return company;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'COMPANY',
        { update: true },
        ctx.clientId,
        'You are not permitted to update company'
      );

      const company = await CompanyModel.findByIdAndUpdate(input.id, input, {
        new: true,
      });

      return company;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'COMPANY',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete company'
      );

      const company = await CompanyModel.findByIdAndDelete(input.id);

      return company;
    }),

  // pagination with search companys by name
  companys: protectedProcedure
    .input(
      z
        .object({
          page: z.number(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'COMPANY',
        { read: true },
        ctx.clientId,
        'You are not permitted to read company'
      );

      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
        sort: {
          name: 1,
        },
      };

      const query = {
        companyId: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const companys = await CompanyModel.paginate(query, options);

      return companys;
    }),
});
