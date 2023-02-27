import React from 'react';
import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import { ScrollArea } from '@mantine/core';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

const Index = () => {
  const createProduct = trpc.productRouter.create.useMutation();
  const router = useRouter();

  const initialValues = {
    id: '',
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
    expireDate: '',
  };
  return (
    <Layout>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <ScrollArea style={{ height: '100%' }}>
          <ProductForm
            formInputs={initialValues}
            onSubmit={(values) => {
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
