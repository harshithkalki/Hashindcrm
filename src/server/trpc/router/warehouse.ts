import { protectedProcedure, router } from '../trpc';
import {
  ZWarehouseCreateInput,
  ZWarehouseUpdateInput,
} from '@/zobjs/warehouse';
import WarehouseModel from '@/models/Warehouse';
import checkPermission from '@/utils/checkPermission';
import { z } from 'zod';

export const warehouseRouter = router({
  create: protectedProcedure
    .input(ZWarehouseCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'WAREHOUSE',
        { create: true },
        ctx.clientId,
        'You are not permitted to create warehouse'
      );

      const warehouse = await WarehouseModel.create({
        ...input,
        company: client.company,
      });

      return warehouse;
    }),

  update: protectedProcedure
    .input(ZWarehouseUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'WAREHOUSE',
        { update: true },
        ctx.clientId,
        'You are not permitted to update warehouse'
      );

      const warehouse = await WarehouseModel.findByIdAndUpdate(
        input._id,
        {
          $set: {
            ...input,
            company: client.company,
          },
        },
        {
          new: true,
        }
      );

      return warehouse;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'WAREHOUSE',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete warehouse'
      );

      const warehouse = await WarehouseModel.findByIdAndDelete(input._id);

      return warehouse;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'WAREHOUSE',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
      );

      const warehouse = await WarehouseModel.findOne({
        _id: input._id,
        company: client.company,
      });

      return warehouse;
    }),

  warehouses: protectedProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'WAREHOUSE',
        { read: true },
        ctx.clientId,
        'You are not permitted to read warehouse'
      );

      const { page = 1, limit = 10, search } = input || {};

      const options = {
        page: page,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const warehouses = await WarehouseModel.paginate(query, options);

      return warehouses;
    }),
});
