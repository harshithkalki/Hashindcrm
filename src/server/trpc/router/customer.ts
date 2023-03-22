import { router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import { ZCustomerCreateInput, ZCustomerUpdateInput } from '@/zobjs/customer';
import { protectedProcedure } from '../trpc';
import Customer from '@/models/Customer';
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

      const customer = new Customer({
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

      const customer = await Customer.updateOne({ _id: input._id }, input);

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

      const customer = await Customer.deleteOne({ _id: input._id });

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

      const customer = await Customer.findOne({ _id: input._id });

      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;
    }),

  customers: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CUSTOMER',
        { read: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
      );

      const { cursor: page = 1, limit = 10, search } = input || {};

      const options = {
        page: page ?? undefined,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const customers = await Customer.paginate(query, options);

      return customers;
    }),
});
