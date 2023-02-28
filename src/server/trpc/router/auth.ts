import { env } from '@/env/server.mjs';
import type { IRole } from '@/models/Role';
import StaffMem from '@/models/StaffMem';
import { getJWTToken } from '@/utils/jwt';
import { ZRole } from '@/zobjs/role';
import { ZStaffMem } from '@/zobjs/staffMem';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const auth = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.email === env.SUPER_ADMIN_EMAIL) {
        if (input.password === env.SUPER_ADMIN_PASSWORD) {
          const token = getJWTToken(input.email);

          ctx.res.setHeader(
            'Set-Cookie',
            `token=${token}; expires=${new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            )}; httpOnly; path=/`
          );

          return {
            success: true,
          };
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid credentials',
          });
        }
      }

      const staff = await StaffMem.findOne({ email: input.email });

      if (!staff) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const isMatch = await staff.comparePassword(input.password);

      if (!isMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const token = staff.getJWTToken();

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

  me: protectedProcedure
    .output(
      z.object({
        success: z.boolean(),
        data: z.discriminatedUnion('isSuperAdmin', [
          ZStaffMem.partial()
            .extend({
              role: z.literal('super-admin'),
              email: z.string(),
              isSuperAdmin: z.literal(true),
            })
            .omit({ password: true }),
          ZStaffMem.extend({
            role: ZRole.omit({ staffMem: true }),
            isSuperAdmin: z.literal(false),
          }).omit({ password: true }),
        ]),
      })
    )
    .query(async ({ ctx }) => {
      if (ctx.clientId === env.SUPER_ADMIN_EMAIL) {
        return {
          success: true,
          data: {
            isSuperAdmin: true,
            email: env.SUPER_ADMIN_EMAIL,
            role: 'super-admin',
          },
        };
      }

      const res = await StaffMem.findById(ctx.clientId)
        .select('-password')
        .populate<{ role: IRole & { _id: string } }>('role', '-staffMem')
        .lean();

      if (!res) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const { password: _, ...staff } = res;

      return {
        success: true,
        data: {
          isSuperAdmin: false,
          ...staff,
          linkedTo: staff.linkedTo?.toString(),
          ticket: staff.ticket?.toString(),
          company: staff.company.toString(),
          role: {
            ...staff.role,
            company: staff.role.company.toString(),
          },
        },
      };
    }),
});
