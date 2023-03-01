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
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

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
      if (ctx.clientId !== env.SUPER_ADMIN_EMAIL) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create company',
        });
      }

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
