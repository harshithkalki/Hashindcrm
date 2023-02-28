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
        'SUPPLIER',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read suppliers"
      );

      const { page = 1, limit = 10, search = '' } = input ?? {};

      const suppliers = await Supplier.find({
        name: { $regex: search, $options: 'i' },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Supplier.countDocuments({
        name: { $regex: search, $options: 'i' },
      });

      return {
        suppliers: suppliers.map((supplier) => supplier.toObject()),
        total,
      };
    }),
});
