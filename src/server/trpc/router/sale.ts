import Sale from '@/models/Sale';
import Count from '@/models/Count';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import checkPermission from '@/utils/checkPermission';
import type { ZSale } from '@/zobjs/sale';
import { ZSaleCreateInput, ZSaleUpdateInput } from '@/zobjs/sale';
import { z } from 'zod';
import type CompanyModel from '@/models/Company';
import WarehouseModel from '@/models/Warehouse';
import type { Warehouse } from '@/zobjs/warehouse';
import type { Company } from '@/zobjs/company';
import console from 'console';
import type { Product } from '@/zobjs/product';

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
          name: 'invoice',
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
          name: 'invoice',
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
          _id: input.id,
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

  sales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
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

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
      };

      const brands = await Sale.paginate(query, options);

      return brands;
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(
      async ({
        input,
        ctx,
        // }): Promise<
        //   ModifyDeep<
        //     Omit<z.infer<typeof ZSale>, 'products' | 'warehouse'>,
        //     {
        //       company?: Company;
        //       // warehouse?: Warehouse;
        //       products: {
        //         _id: string;
        //         name: string;
        //         price: number;
        //         quantity: number;
        //       }[];
        //     }
        //   >
        // > => {
      }) => {
        const client = await checkPermission(
          'SALES',
          {
            read: true,
          },
          ctx.clientId,
          "You don't have permission to read sales"
        );

        const sale = await Sale.findById(input._id)
          .populate<{
            company: Company;
            products: {
              _id: Product & { _id: string };
              price: number;
              quantity: number;
            }[];
          }>('products._id company')
          .lean();

        if (!sale) {
          throw new Error('Sale not found');
        }

        const warehouse =
          (await WarehouseModel.findById(sale.warehouse).lean()) ?? undefined;

        return {
          ...sale,
          warehouse,
          products: sale.products.map((product) => ({
            ...product,
            ...product._id,
            quantity: product.quantity,
          })),
        };
      }
    ),

  getCashSales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
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

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'cash',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getCardSales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
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

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'card',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),

  getUPISales: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().optional(),
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

      const { cursor: page, limit = 10 } = input || {};

      const options = {
        page: page ?? 1,
        limit: limit,
      };

      const query = {
        company: client.company,
        paymentMode: 'upi',
      };

      const sales = await Sale.paginate(query, options);

      return sales;
    }),
});
