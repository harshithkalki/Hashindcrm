import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import StockTransferModel from '@/models/StockTransfer';
import checkPermission from '@/utils/checkPermission';
import ProductModel from '@/models/Product';
import {
  ZStockTransferCreateInput,
  ZStockTransferUpdateInput,
} from '@/zobjs/stockTransfer';
import Count from '@/models/Count';
import type { ProductCreateInput } from '@/zobjs/product';
import type { Company } from '@/zobjs/company';
import type { Product as ProductType } from '@/zobjs/product';
import Warehouse from '@/models/Warehouse';

export const stockTransferRouter = router({
  create: protectedProcedure
    .input(ZStockTransferCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKTRANSFER',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create stocktransfer'
      );

      let counter = await Count.findOneAndUpdate(
        { name: 'stocktransfer' },
        { $inc: { count: 1 } },
        { new: true }
      );

      if (!counter) {
        counter = await new Count({
          name: 'stocktransfer',
          count: 1,
        }).save();
      }

      const stocktransfer = await StockTransferModel.create({
        ...input,
        company: client.company,
        invoiceId: `ST-${counter?.count}`,
      });

      const fromproducts = await ProductModel.find({
        _id: { $in: stocktransfer.products.map((p) => p.product) },
      }).lean();

      const updatedProducts = fromproducts.map((p) => {
        const product = stocktransfer.products.find(
          (product) => product.product.toString() === p._id.toString()
        );

        if (!product) throw new Error('Product not found');

        return {
          ...p,
          quantity: p.quantity - product.quantity,
        };
      });

      await ProductModel.bulkWrite(
        updatedProducts.map((p) => ({
          updateOne: {
            filter: { _id: p._id },
            update: { $set: { quantity: p.quantity } },
          },
        }))
      );

      const productsTo = await ProductModel.find({
        name: { $in: fromproducts.map((p) => p.name) },
        warehouse: input.toWarehouse,
      }).lean();

      if (productsTo.length === 0) {
        const newProducts: ProductCreateInput[] = fromproducts.map((p) => {
          const product = stocktransfer.products.find(
            (product) => product.product.toString() === p._id.toString()
          );

          if (!product) throw new Error('Product not found');

          const { _id: _, ...rest } = p;

          return {
            ...rest,
            warehouse: input.toWarehouse,
            quantity: product.quantity,
            openingStockDate: p.openingStockDate.toISOString(),
            category: p.category.toString(),
            brand: p.brand.toString(),
          };
        });

        await ProductModel.create(newProducts);

        return stocktransfer;
      }

      const updatedProductsTo = fromproducts.map((p) => {
        const product = productsTo.find((product) => product.name === p.name);

        if (!product) {
          const product = stocktransfer.products.find(
            (product) => product.product.toString() === p._id.toString()
          );

          const { _id: _, ...rest } = p;

          ProductModel.create({
            ...rest,
            warehouse: input.toWarehouse,
            quantity: product?.quantity,
            openingStockDate: p.openingStockDate.toISOString(),
            category: p.category.toString(),
            brand: p.brand.toString(),
          }).then((res) => null);

          return;
        }

        const inputQuantity = stocktransfer.products.find(
          (product) => product.product.toString() === p._id.toString()
        );

        if (!inputQuantity) throw new Error('Product not found');

        return {
          ...product,
          quantity: product.quantity + inputQuantity.quantity,
        };
      });

      await ProductModel.bulkWrite(
        updatedProductsTo.map((p) => ({
          updateOne: {
            filter: { _id: p?._id },
            update: { $set: { quantity: p?.quantity } },
          },
        }))
      );

      return stocktransfer;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKTRANSFER',
        {
          delete: true,
        },
        ctx.clientId,
        'You are not permitted to delete stocktransfer'
      );

      const stocktransfer = await StockTransferModel.findByIdAndDelete(
        input._id
      );

      return stocktransfer;
    }),

  getAllStockTransfers: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'STOCKTRANSFER',
      {
        read: true,
      },
      ctx.clientId,
      'You are not permitted to get stocktransfers'
    );

    const stocktransfers = await StockTransferModel.find({
      company: client.company,
    })
      .populate('warehouse', 'name')
      .lean();

    return stocktransfers;
  }),

  stockTransfers: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'BRAND',
        { read: true },
        ctx.clientId,
        'You are not permitted to read stocktransfers'
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

      const stocktransfers = await StockTransferModel.paginate(query, options);

      return stocktransfers;
    }),

  update: protectedProcedure
    .input(ZStockTransferUpdateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKTRANSFER',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to update stocktransfer'
      );

      const stocktransfer = await StockTransferModel.findByIdAndUpdate(
        input._id,
        input,
        {
          new: true,
        }
      );

      return stocktransfer;
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'STOCKTRANSFER',
        {
          read: true,
        },
        ctx.clientId,
        'You are not permitted to get stocktransfer'
      );

      const stocktransfer = await StockTransferModel.findById(input._id).populate<{
        company: Company;
        products: {
          product: ProductType & { _id: string };
          price: number;
          quantity: number;
        }[];
      }>('products.product company')
        .lean();

      if (!stocktransfer) {
        throw new Error('Sale return not found');
      }

      const warehouse = (await Warehouse.findById(stocktransfer.warehouse).lean()) ?? undefined;


      const invoice = {
        ...stocktransfer,
        warehouse,
        products: stocktransfer.products.map((product) => ({
          ...product,
          ...product.product,
          quantity: product.quantity,
        })),
        customer: 'Walk in Customer',
        date: stocktransfer.createdAt,
      }

      return invoice;
    }
    ),

});
