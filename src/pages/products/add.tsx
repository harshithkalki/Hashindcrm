import React from 'react';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { ScrollArea, Title } from '@mantine/core';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import type { z } from 'zod';
import type { ZProductCreateInput } from '@/zobjs/product';

const Index = () => {
  const createProduct = trpc.productRouter.create.useMutation();
  const router = useRouter();

  const initialValues: z.infer<typeof ZProductCreateInput> = {
    name: '',
    logo: '',
    warehouse: '',
    category: '',
    brand: '',
    salePrice: 0,
    purchasePrice: 0,
    quantity: 0,
    description: '',
    quantityAlert: 0,
    barcodeSymbology: '',
    itemCode: '',
    mrp: 0,
    openingStock: 0,
    openingStockDate: '',
    slug: '',
    tax: 0,
    expiryDate: '',
  };
  return (
    <Layout>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <ScrollArea style={{ flex: 1 }}>
          <Title fw={400} mx='md'>
            Add Product
          </Title>
          <ProductForm
            formInputs={initialValues}
            onSubmit={async (values) => {
              return createProduct.mutateAsync(values).then(() => {
                router.push('/products');
              });
            }}
          />
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default Index;
