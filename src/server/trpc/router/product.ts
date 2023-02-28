import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ProductModel from '@/models/Product';
import type { WarehouseDocument } from '@/models/Warehouse';
import checkPermission from '@/utils/checkPermission';
import type { CategoryDocument } from '@/models/Category';
import CategoryModel from '@/models/Category';
import type { BrandDocument } from '@/models/Brand';
import { ZProductCreateInput, ZProductUpdateInput } from '@/zobjs/product';

const getAllChildCategories = async (
  category: string
): Promise<
  {
    _id: string;
    name: string;
    slug: string;
    parentCategory: string;
  }[]
> => {
  const categories = await CategoryModel.find({
    parentCategory: category,
  }).lean();

  if (categories.length === 0) {
    return [];
  }

  const childCategories = await Promise.all(
    categories.map(async (category) => {
      const child = await getAllChildCategories(category._id.toString());
      return child;
    })
  );

  return [
    ...childCategories.flat(),
    ...categories.map((category) => {
      return {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        parentCategory: category.parentCategory as unknown as string,
      };
    }),
  ];
};

export const productRouter = router({
  create: protectedProcedure
    .input(ZProductCreateInput)
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { create: true },
        ctx.clientId,
        'You are not permitted to create product'
      );

      const product = await ProductModel.create({
        ...input,
        company: client.company,
      });

      return product;
    }),

  getProductsByCategory: protectedProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read products'
      );

      if (input.category === '') {
        return [];
      }

      const products = await ProductModel.find({
        company: client.company,
        category: input.category,
      }).lean();

      if (products.length === 0) {
        const childCategories = await getAllChildCategories(input.category);

        console.log(childCategories, 'childCategories');

        const products = await ProductModel.find({
          company: client.company,
          category: {
            $in: childCategories.map((category) => category._id),
          },
        }).lean();

        return products;
      }

      return products;
    }),

  update: protectedProcedure
    .input(ZProductUpdateInput)
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'PRODUCT',
        { update: true },
        ctx.clientId,
        'You are not permitted to update product'
      );

      const product = await ProductModel.findByIdAndUpdate(input._id, input, {
        new: true,
      });

      return product;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'PRODUCT',
        { delete: true },
        ctx.clientId,
        'You are not permitted to delete product'
      );

      const product = await ProductModel.findByIdAndDelete(input.id);

      return product;
    }),

  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'PRODUCT',
      { read: true, update: true, delete: true },
      ctx.clientId,
      'You are not permitted to read products'
    );

    const products = await ProductModel.find({
      company: client.company,
    })
      .populate<{
        warehouse: WarehouseDocument;
        category: CategoryDocument;
        brand: BrandDocument;
      }>(['warehouse', 'category', 'brand'])
      .lean();

    await Promise.all(
      products.map(async (product) => {
        if (
          !product.category ||
          !(product.category as unknown as { name: string }).name
        ) {
          await ProductModel.deleteOne({ _id: product._id });
        }
      })
    );

    return products.map((val) => ({
      ...val,
      openingStockDate: val.openingStockDate?.toISOString(),
      expiryDate: val.expiryDate,
      brand: val.brand.name,
      category: val.category.name,
      warehouse: val.warehouse.name,
    }));
  }),

  getProducts: protectedProcedure
    .input(
      z
        .object({
          page: z.number(),
          limit: z.number().optional(),
          category: z.string().optional(),
        })
        .optional()
    )

    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read products'
      );

      const { page, limit } = input || {};

      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: {
          name: 1,
        },
        populate: [
          {
            path: 'category',
            select: 'name',
          },
          {
            path: 'brand',
            select: 'name',
          },
          {
            path: 'warehouse',
            select: 'name',
          },
        ],
      };

      const query = {
        company: client.company,
        ...(input?.category && { category: input.category }),
      };

      const products = await ProductModel.paginate(query, options);

      return products;
    }),

  getProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkPermission(
        'PRODUCT',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read products'
      );

      const product = await ProductModel.findById(input.id).lean();

      return product;
    }),

  searchProducts: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { read: true, update: true, delete: true },
        ctx.clientId,
        'You are not permitted to read products'
      );

      const products = await ProductModel.find(
        {
          company: client.company,
          name: { $regex: input.search, $options: 'i' },
        },
        null,
        { limit: input.limit || 10 }
      )
        .populate<{
          warehouse: WarehouseDocument;
          category: CategoryDocument;
          brand: BrandDocument;
        }>(['warehouse', 'category', 'brand'])
        .lean();

      await Promise.all(
        products.map(async (product) => {
          if (
            !product.category ||
            !(product.category as unknown as { name: string }).name
          ) {
            await ProductModel.deleteOne({ _id: product._id });
          }
        })
      );

      return products.map((val) => ({
        ...val,
        openingStockDate: val.openingStockDate?.toISOString(),
        expiryDate: val.expiryDate,
        brand: { ...val.brand, _id: val.brand._id.toString() },
        category: { ...val.category, _id: val.category._id.toString() },
        warehouse: { ...val.warehouse, _id: val.warehouse._id.toString() },
      }));
    }),
});
