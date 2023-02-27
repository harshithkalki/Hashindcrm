import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createContextInner } from '@/server/trpc/context';
import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '@/server/trpc/router/_app';
import type { IBrand } from '@/models/Brand';
import Brand from '@/models/Brand';
import mongoose from 'mongoose';

describe('create brand', async () => {
  const caller = appRouter.createCaller(
    await createContextInner({
      clientId: process.env.TEST_STAFF_ID as string,
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
    })
  );

  it('should create a brand', async () => {
    const brand = await caller.brandRouter.create({
      name: 'Test Brand',
      logo: 'Test Logo',
      slug: 'test-brand',
    });

    const testBrand = await Brand.findById(brand._id);
    expect(testBrand?.toObject()).toMatchObject({
      name: 'Test Brand',
      logo: 'Test Logo',
      slug: 'test-brand',
    });
  });

  it('should throw error if brand slug already exists', async () => {
    await expect(
      caller.brandRouter.create({
        name: 'Test Brand',
        logo: 'Test Logo',
        slug: 'test-brand',
      })
    ).rejects.toThrowError();
  });

  afterAll(async () => {
    await Brand.deleteMany({ companyId: process.env.TEST_COMPANY_ID });
  });
});

describe('get brands', async () => {
  beforeAll(async () => {
    const brands: IBrand[] = Array.from({ length: 20 }).map((_, i) => ({
      name: `Test Brand ${i}`,
      logo: `Test Logo ${i}`,
      slug: `test-brand-${i}`,
      companyId: new mongoose.Types.ObjectId(
        process.env.TEST_COMPANY_ID as string
      ),
    }));

    await Brand.insertMany(brands);
  });

  afterAll(async () => {
    await Brand.deleteMany({ companyId: process.env.TEST_COMPANY_ID });
  });

  const caller = appRouter.createCaller(
    await createContextInner({
      clientId: process.env.TEST_STAFF_ID as string,
      req: {} as NextApiRequest,
      res: {} as NextApiResponse,
    })
  );

  it('should get brands', async () => {
    const brands = await caller.brandRouter.brands();

    expect(brands.docs).toHaveLength(10);
    expect(brands.totalPages).toBe(2);
  });

  it('should get brands with pagination', async () => {
    const brands = await caller.brandRouter.brands({ page: 2, limit: 5 });

    expect(brands.docs).toHaveLength(5);
    expect(brands.totalPages).toBe(4);
  });

  it('should get brands with search', async () => {
    const brands = await caller.brandRouter.brands({
      search: 'Test Brand 1',
      limit: 20,
    });

    expect(brands.docs).toHaveLength(11);
  });

  it('should get brands with search and pagination', async () => {
    const brands = await caller.brandRouter.brands({
      search: 'Test Brand 1',
      page: 1,
      limit: 5,
    });

    expect(brands.docs).toHaveLength(5);
    expect(brands.totalPages).toBe(3);
  });
});
