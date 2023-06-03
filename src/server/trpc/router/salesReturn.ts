import SaleReturn from '@/models/SaleReturn';
import { ZSaleReturnCreateInput } from '@/zobjs/saleReturn';
import { protectedProcedure, router } from '../trpc';
import checkPermission from '@/utils/checkPermission';
import Product from '@/models/Product';
import { z } from 'zod';
import mongoose from 'mongoose';
import Customer from '@/models/Customer';
import type { Company } from '@/zobjs/company';
import type { Product as ProductType } from '@/zobjs/product';
import WarehouseModel from '@/models/Warehouse';

export const saleReturnRouter = router({
  create: protectedProcedure
    .input(ZSaleReturnCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'SALES',
        {
          create: true,
        },
        ctx.clientId,
        "You don't have permission to create sale return"
      );

      const saleReturn = await SaleReturn.create({
        ...input,
        company: client.company,
      });

      await Promise.all(
        input.products.map(async (product) => {
          const productModel = await Product.findOne({
            _id: product._id,
          });

          if (!productModel) {
            throw new Error('Product not found');
          }

          await productModel.updateOne({
            $inc: {
              quantity: product.quantity,
            },
          });
        })
      );

      return saleReturn;
    }),

  returns: protectedProcedure
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
        sort: {
          createdAt: -1,
        },
      };

      const query = {
        company: client.company,
      };

      const brands = await SaleReturn.paginate(query, {
        ...options,
        lean: true,
      });

      const brandsWithCustomer = await Promise.all(
        brands.docs.map(async (brand) => {
          if (mongoose.isValidObjectId(brand.customer)) {
            const customer = await Customer.findOne({
              _id: brand.customer,
            }).lean();
            return { ...brand, customer: customer ?? 'Walk in Customer' };
          }

          return { ...brand, customer: 'Walk in Customer' };
        })
      );

      return {
        ...brands,
        docs: brandsWithCustomer,
      };
    }),

  getInvoice: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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

      const saleReturn = await SaleReturn.findOne({
        _id: input.id,
        company: client.company,
      }).populate<{
        company: Company;
        products: {
          _id: ProductType & { _id: string };
          price: number;
          quantity: number;
        }[];
      }>('products._id company').lean();

      if (!saleReturn) {
        throw new Error('Sale return not found');
      }

      const warehouse = (await WarehouseModel.findById(saleReturn.warehouse).lean()) ?? undefined;


      return {
        ...saleReturn, warehouse,
        products: saleReturn.products.map((product) => ({
          ...product,
          ...product._id,
          quantity: product.quantity,
        })),
        customer: mongoose.isValidObjectId(saleReturn?.customer)
          ? await Customer.findOne({
            _id: saleReturn?.customer,
          }).lean()
          : 'Walk in Customer',
      };
    }
    ),
});
