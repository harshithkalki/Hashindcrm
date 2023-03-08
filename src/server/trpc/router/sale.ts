import Sale from '@/models/Sale';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import { ZSaleCreateInput, ZSaleUpdateInput } from '@/zobjs/sale';
import { z } from 'zod';

export const saleRouter = router({
  create: protectedProcedure
    .input(ZSaleCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create sales"
      );

      let invoiceId = '';

      const count = await Count.findOneAndUpdate(
        {
          company: client.company,
        },
        {
          $inc: {
            count: 1,
          },
        },
        {
          new: true,
        }
      );

      if (count) {
        invoiceId = `${count.count}`;
      } else {
        const newCount = await Count.create({
          count: 1,
          company: client.company,
        });

        invoiceId = `${newCount.count}`;
      }

      const sale = await Sale.create({
        ...input,
        company: client.company,
        invoiceId,
        customer: !input.customer ? 'Walk in Customer' : input.customer,
      });

      return sale;
    }),

  update: protectedProcedure
    .input(ZSaleUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update sales"
      );

      const sale = await Sale.findOneAndUpdate(
        {
          invoiceId: input.id,
          company: client.company,
        },
        input,
        {
          new: true,
        }
      );

      return sale;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete sales"
      );

      const sale = await Sale.findOneAndDelete({
        invoiceId: input._id,
        company: client.company,
      });

      return sale;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const sale = await Sale.findById(input._id);

      return sale;
    }),

  getByInvoiceId: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read sales"
      );

      const sale = await Sale.findOne({
        invoiceId: input.invoiceId,
        company: client.company,
      });

      return sale;
    }),
});
