import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import CarModel from '@/models/Car';
import checkPermission from '@/utils/checkPermission';
import { ZCarCreateInput, ZCarUpdateInput } from '@/zobjs/car';

export const carRouter = router({
  create: protectedProcedure
    .input(ZCarCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'CUSTOMER',
        { create: true },
        ctx.clientId,
        'You are not permitted to create car'
      );

      const car = await CarModel.create({
        ...input,
        company: client.company,
      });

      return car;
    }),

  update: protectedProcedure
    .input(ZCarUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'CUSTOMER',
        { update: true },
        ctx.clientId,
        'You are not permitted to update car'
      );

      const car = await CarModel.findByIdAndUpdate(input._id, input, {
        new: true,
      });

      return car;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'CUSTOMER',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete car'
      );

      const car = await CarModel.findByIdAndDelete(input._id);

      return car;
    }),

  // pagination with search cars by name
  cars: protectedProcedure
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
        'You are not permitted to read car'
      );

      const { cursor: page, limit = 10, search } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        ...(search && { name: { $regex: search, $options: 'i' } }),
      };

      const cars = await CarModel.paginate(query, options);

      return cars;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'CUSTOMER',
        { read: true },
        ctx.clientId,
        'You are not permitted to read car'
      );

      const car = await CarModel.findById(input._id);

      return car;
    }),
});
