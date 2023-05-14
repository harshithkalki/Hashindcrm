import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/StaffMem';
import TicketModel from '@/models/Ticket';
import StatusModel from '@/models/Status';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';
import { ZTicketCreateInput, ZTicketUpdateInput } from '@/zobjs/ticket';

export const ticketRouter = router({
  createTicket: protectedProcedure
    .input(
      ZTicketCreateInput
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'TICKET',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create a ticket'
      );

      const isValidStatus = await StatusModel.exists({
        _id: input.status,
        companyId: client.company,
        initialStatus: true,
      });

      if (!isValidStatus) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid status',
        });
      }

      const ticket = await TicketModel.create({
        name: input.name,
        status: input.status,
        companyId: client.company,
        description: input.description,
        issueType: input.issueType,
        files: input.files,
      });

      return ticket.toObject();
    }),

  updateTicket: protectedProcedure
    .input(
      ZTicketUpdateInput
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'TICKET',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to update a ticket'
      );

      const ticket = await TicketModel.findByIdAndUpdate(input._id, input);

      return ticket;
    }),

  tickets: protectedProcedure.input(z.object({
    cursor: z.number().optional(),
    limit: z.number().optional(),
  })).query(async ({ ctx, input }) => {
    const client = await checkPermission(
      'TICKET',
      {
        delete: true,
        read: true,
        update: true,
      },
      ctx.clientId,
      'You are not permitted to read products'
    );

    const { cursor: page, limit = 10 } = input || {};

    const options = {
      page: page ?? 1,
      limit: limit,
      sort: {
        createdAt: -1,
      },
    };

    const query = {
      company: client.company,
    };

    const tickets = await TicketModel.paginate(query, {
      ...options,
      lean: true,
      populate: [{
        path: 'status',
        select: 'name _id',
      }]
    });



    return tickets;
  }),

  assignTicket: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'TICKET',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to update a ticket'
      );

      const ticket = await TicketModel.findByIdAndUpdate(input.ticketId, {
        assignedTo: input.userId,
      });

      return ticket;
    }),

  getAssignableUsers: protectedProcedure
    .query(async ({ ctx }) => {
      const client = await checkPermission(
        'TICKET',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to read tickets'
      );

      const parent = await UserModel.findById(client.reportTo);

      const user = await UserModel.find({
        companyId: client.company,
        $or: [
          {
            role: parent?.role,
          }, {
            reportTo: client.id
          }
        ]
      }).populate<{
        role: {
          name: string;
          _id: string;
        };
      }>({
        path: 'role',
        select: 'name _id',
      })
        .lean();

      return user;
    }),
});
