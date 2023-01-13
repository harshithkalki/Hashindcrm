import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/userModel';
import StatusModel from '@/models/Status';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';

// name: {
//   type: String,
//   required: true,
// },
// createdAt: {
//   type: Date,
//   required: false,
//   default: Date.now,
// },
// companyId: {
//   type: Schema.Types.ObjectId,
//   required: true,
// },
// status: {
//   type: Schema.Types.ObjectId,
//   required: true,
//   ref: 'Ticket',
// },

export const ticketRouter = router({
  createTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string(),
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

      const status = await StatusModel.create({
        ...input,
        companyId: client.companyId,
      });

      return status;
    }),
});
