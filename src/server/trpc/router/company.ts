import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CompanyModel from '@/models/Company';
import { ZCompanyCreateInput, ZCompanyUpdateInput } from '@/zobjs/company';
import { env } from '@/env/server.mjs';
import { TRPCError } from '@trpc/server';

export const companyRouter = router({
  create: protectedProcedure
    .input(ZCompanyCreateInput)
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

      const company = await CompanyModel.create({
        ...input,
      });

      return company;
    }),

  update: protectedProcedure
    .input(ZCompanyUpdateInput)
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

      const company = await CompanyModel.findByIdAndUpdate(input._id, input, {
        new: true,
      });

      return company;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

      const company = await CompanyModel.findByIdAndDelete(input._id);

      return company;
    }),

  companies: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        search: z.string().optional(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const companys = await CompanyModel.paginate(query, options);

      return {
        ...companys,
        docs: companys.docs.map((company) => ({
          ...company.toObject(),
          _id: company._id.toString(),
        })),
      };
    }),

  company: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

      const company = await CompanyModel.findById(input._id).lean();

      if (!company) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Company not found',
        });
      }

      return {
        ...company,
        _id: company?._id.toString(),
      };
    }),
});
