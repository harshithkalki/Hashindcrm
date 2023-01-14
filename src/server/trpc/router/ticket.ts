import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/userModel';
import TicketModel from '@/models/Ticket';
import StatusModel from '@/models/Status';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';

export const ticketRouter = router({
  createTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string().refine(async (val) => {
          if (val)
            return Boolean(
              StatusModel.findOne({ _id: val, initialStatus: true })
            );

          return true;
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const isPermitted = await checkPermission(
        'TICKET',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const ticket = await TicketModel.create({
        name: input.name,
        status: input.status,
        companyId: client.companyId,
      });

      return ticket;
    }),

  updateTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        nextStatusId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const isPermitted = await checkPermission(
        'TICKET',
        'update',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const ticket = await TicketModel.findByIdAndUpdate(input.ticketId, {
        status: input.nextStatusId,
      });

      return ticket;
    }),
});
