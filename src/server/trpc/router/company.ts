import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CompanyModel from '@/models/Company';
import checkPermission from '@/utils/checkPermission';
import { ZCompanyCreateInput, ZCompanyUpdateInput } from '@/zobjs/company';

export const companyRouter = router({
  create: protectedProcedure
    .input(ZCompanyCreateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'COMPANY',
        { create: true },
        ctx.clientId,
        'You are not permitted to create company'
      );

      const company = await CompanyModel.create({
        ...input,
      });

      return company;
    }),

  update: protectedProcedure
    .input(ZCompanyUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'COMPANY',
        { update: true },
        ctx.clientId,
        'You are not permitted to update company'
      );

      const company = await CompanyModel.findByIdAndUpdate(input._id, input, {
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
      await checkPermission(
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
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const companys = await CompanyModel.paginate(query, options);

      return companys;
    }),
});
