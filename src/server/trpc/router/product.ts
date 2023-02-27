import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import ProductModel from '@/models/Product';
import type { WarehouseDocument } from '@/models/Warehouse';
import WarehouseModel from '@/models/Warehouse';
import checkPermission from '@/utils/checkPermission';
import type { CategoryDocument } from '@/models/Category';
import CategoryModel from '@/models/Category';
import type { BrandDocument } from '@/models/Brand';

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
    .input(
      z.object({
        name: z.string().min(3).max(50),
        logo: z.string().optional(),
        warehouse: z.string(),
        slug: z.string(),
        quantity: z.number(),
        quantityAlert: z.number(),
        category: z.string(),
        brand: z.string(),
        barcodeSymbology: z.string(),
        itemCode: z.string(),
        openingStock: z.number(),
        openingStockDate: z.string(),
        purchasePrice: z.number(),
        salePrice: z.number(),
        mrp: z.number(),
        tax: z.number(),
        expireDate: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { create: true },
        ctx.userId,
        'You are not permitted to create product'
      );

      const product = await ProductModel.create({
        ...input,
        companyId: client.companyId,
      });

      return product;
    }),

  createWarehouse: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await checkPermission(
        'PRODUCT',
        { create: true },
        ctx.userId,
        'You are not permitted to create warehouse'
      );

      const warehouse = await WarehouseModel.create({
        ...input,
        companyId: client.companyId,
      });

      return warehouse;
    }),

  getAllWarehouse: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'PRODUCT',
      { read: true, update: true, delete: true },
      ctx.userId,
      'You are not permitted to read warehouses'
    );

    const warehouse = await WarehouseModel.find({
      companyId: client.companyId,
    });

    return warehouse;
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
        ctx.userId,
        'You are not permitted to read products'
      );

      if (input.category === '') {
        return [];
      }

      const products = await ProductModel.find({
        companyId: client.companyId,
        category: input.category,
      }).lean();

      if (products.length === 0) {
        const childCategories = await getAllChildCategories(input.category);

        console.log(childCategories, 'childCategories');

        const products = await ProductModel.find({
          companyId: client.companyId,
          category: {
            $in: childCategories.map((category) => category._id),
          },
        }).lean();

        return products;
      }

      return products;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        logo: z.string(),
        quantity: z.number(),
        quantityAlert: z.number(),
        category: z.string(),
        // product: z.string(),
        // barcode: z.string(),
        itemCode: z.string(),
        openingStock: z.number(),
        openingStockDate: z.string(),
        purchasePrice: z.number(),
        salePrice: z.number(),
        tax: z.number(),
        mrp: z.number(),
        expiryDate: z.string().optional(),
        description: z.string().optional(),
        warehouse: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPermission(
        'PRODUCT',
        { update: true },
        ctx.userId,
        'You are not permitted to update product'
      );

      const product = await ProductModel.findByIdAndUpdate(input.id, input, {
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
        ctx.userId,
        'You are not permitted to delete product'
      );

      const product = await ProductModel.findByIdAndDelete(input.id);

      return product;
    }),

  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'PRODUCT',
      { read: true, update: true, delete: true },
      ctx.userId,
      'You are not permitted to read products'
    );

    const products = await ProductModel.find({
      companyId: client.companyId,
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
      expiryDate: val.expiryDate?.toISOString(),
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
        ctx.userId,
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
        companyId: client.companyId,
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
        ctx.userId,
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
        ctx.userId,
        'You are not permitted to read products'
      );

      const products = await ProductModel.find(
        {
          companyId: client.companyId,
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
        expiryDate: val.expiryDate?.toISOString(),
        brand: { ...val.brand, _id: val.brand._id.toString() },
        category: { ...val.category, _id: val.category._id.toString() },
        warehouse: { ...val.warehouse, _id: val.warehouse._id.toString() },
      }));
    }),
});
