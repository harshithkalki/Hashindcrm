import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/StaffMem';
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
      const client = await checkPermission(
        'TICKET',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create a ticket'
      );

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
      await checkPermission(
        'TICKET',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to update a ticket'
      );

      const ticket = await TicketModel.findByIdAndUpdate(input.ticketId, {
        status: input.nextStatusId,
      });

      return ticket;
    }),

  getAllTicket: protectedProcedure.query(async ({ ctx }) => {
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

    const tickets = TicketModel.find({ companyId: client.companyId }).populate<{
      assignedTo: {
        firstName: string;
        lastName: string;
        middlename: string;
        role: {
          name: string;
          _id: string;
        };
        _id: string;
      } | null;
    }>({
      path: 'assignedTo',
      select: 'firstName lastName middlename',
      populate: {
        path: 'role',
        select: 'name',
      },
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
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'TICKET',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to read tickets'
      );

      const ticket = await TicketModel.findOne({
        _id: input.ticketId,
        companyId: client.companyId,
        assignedTo: client._id,
      });

      if (!ticket) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to assign a ticket',
        });
      }

      const childUsers = await UserModel.find({
        linkedTo: client._id,
        companyId: client.companyId,
      })
        .select('firstName lastName middleName')
        .populate<{ role: { name: string } }>('role', 'name')
        .lean();

      const parentUser = await UserModel.findById(client.linkedTo)
        .select('firstName lastName middleName')
        .populate<{ role: { name: string } }>('role', 'name')
        .lean();

      const allparentUsers = await UserModel.find({
        role: parentUser?.role,
        companyId: client.companyId,
      })
        .select('firstName lastName middleName')
        .populate<{ role: { name: string } }>('role', 'name')
        .lean();

      const allUsers = [...childUsers, ...allparentUsers];

      return allUsers;
    }),
});
