import { router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import { ZSupplierCreateInput, ZSupplierUpdateInput } from '@/zobjs/supplier';
import { protectedProcedure } from '../trpc';
import Supplier from '@/models/Supplier';
import { z } from 'zod';

export const supplierRouter = router({
  create: protectedProcedure
    .input(ZSupplierCreateInput)
    .mutation(async ({ ctx, input }) => {
      const client = await checkPermission(
        'SUPPLIER',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create a supplier"
      );

      const supplier = new Supplier({
        ...input,
        company: client.company,
      });

      await supplier.save();

      return supplier.toObject();
    }),

  update: protectedProcedure
    .input(ZSupplierUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const client = await checkPermission(
        'SUPPLIER',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update a supplier"
      );

      const supplier = await Supplier.updateOne({ _id: input._id }, input);

      return supplier;
    }),

  delete: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkPermission(
        'SUPPLIER',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete a supplier"
      );

      const supplier = await Supplier.deleteOne({ _id: input._id });

      return supplier;
    }),

  get: protectedProcedure
    .input(z.object({ _id: z.string() }))
    .query(async ({ ctx, input }) => {
      await checkPermission(
        'SUPPLIER',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read a supplier"
      );

      const supplier = await Supplier.findOne({ _id: input._id });

      return supplier;
    }),

  suppliers: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SUPPLIER',
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

      const suppliers = await Supplier.paginate(query, options);

      return suppliers;
    }),
});
