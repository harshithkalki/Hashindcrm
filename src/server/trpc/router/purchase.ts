import Purchase from '@/models/Purchase';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import type { ZPurchase } from '@/zobjs/purchase';
import { ZPurchaseCreateInput, ZPurchaseUpdateInput } from '@/zobjs/purchase';
import { z } from 'zod';
import type CompanyModel from '@/models/Company';
import WarehouseModel from '@/models/Warehouse';
import type { Warehouse } from '@/zobjs/warehouse';
import type { Company } from '@/zobjs/company';
import type { Product } from '@/zobjs/product';

export const purchaseRouter = router({
  create: protectedProcedure
    .input(ZPurchaseCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create purchases"
      );

      let invoiceId = '';

      const count = await Count.findOneAndUpdate(
        {
          company: client.company,
          name: 'purchase',
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
          name: 'purchase',
        });

        invoiceId = `${newCount.count}`;
      }

      const purchase = await Purchase.create({
        ...input,
        company: client.company,
        invoiceId,
        supplier: input.supplier,
      });

      return purchase;
    }),

  update: protectedProcedure
    .input(ZPurchaseUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          update: true,
        },
        ctx.clientId,
        "You don't have permission to update purchases"
      );

      const purchase = await Purchase.findOneAndUpdate(
        {
          invoiceId: input.id,
          company: client.company,
        },
        input,
        {
          new: true,
        }
      );

      return purchase;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          delete: true,
        },
        ctx.clientId,
        "You don't have permission to delete purchases"
      );

      const purchase = await Purchase.findOneAndDelete({
        invoiceId: input._id,
        company: client.company,
      });

      return purchase;
    }),

  get: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findById(input._id);

      return purchase;
    }),

  getByInvoiceId: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findOne({
        invoiceId: input.invoiceId,
        company: client.company,
      });

      return purchase;
    }),

  purchases: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
      };

      const brands = await Purchase.paginate(query, options);

      return brands;
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PURCHASE',
        {
          read: true,
        },
        ctx.clientId,
        "You don't have permission to read purchases"
      );

      const purchase = await Purchase.findById(input._id)
        .populate<{
          company: Company;
          products: {
            _id: Product & { _id: string };
            price: number;
            quantity: number;
          }[];
        }>('products._id company')
        .lean();

      if (!purchase) {
        throw new Error('Purchase not found');
      }

      const warehouse =
        (await WarehouseModel.findById(purchase.warehouse).lean()) ?? undefined;

      return {
        ...purchase,
        warehouse,
        products: purchase.products.map((product) => ({
          ...product,
          ...product._id,
          quantity: product.quantity,
        })),
      };
    }),
});
