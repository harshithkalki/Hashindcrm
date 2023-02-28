import { router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import { ZCustomerCreateInput, ZCustomerUpdateInput } from '@/zobjs/customer';
import { protectedProcedure } from '../trpc';
import Cu from '@/models/Customer';
import { z } from 'zod';

export const customerRouter = router({
  create: protectedProcedure
    .input(ZCustomerCreateInput)
    .mutation(async ({ ctx, input }) => {
      const client = await checkPermission(
        'CUSTOMER',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create a customer"
      );

      const customer = new Cu({
        ...input,
        company: client.company,
      });

      await customer.save();

      return customer.toObject();
    }),

  update: protectedProcedure
    .input(ZCustomerUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const client = await checkPermission(
        'CUSTOMER',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update a customer"
      );

      const customer = await Cu.updateOne({ _id: input._id }, input);

      return customer;
    }),

  delete: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkPermission(
        'CUSTOMER',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete a customer"
      );

      const customer = await Cu.deleteOne({ _id: input._id });

      return customer;
    }),

  get: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .query(async ({ ctx, input }) => {
      await checkPermission(
        'CUSTOMER',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read a customer"
      );

      const customer = await Cu.findOne({ _id: input._id });

      return customer;
    }),

  customers: protectedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      await checkPermission(
        'CUSTOMER',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read customers"
      );

      const { page = 1, limit = 10, search = '' } = input ?? {};

      const customers = await Cu.find({
        name: { $regex: search, $options: 'i' },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Cu.countDocuments({
        name: { $regex: search, $options: 'i' },
      });

      return {
        customers: customers.map((customer) => customer.toObject()),
        total,
      };
    }),
});
