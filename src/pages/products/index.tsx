// import ProductTable from '@/components/Tables/ProductsTable';
import { Button, Divider, Group, Title } from '@mantine/core';
import React from 'react';
// import { useRouter } from "next/router";

import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import Layout from '@/components/Layout';
import ProductTable from '@/components/Tables/ProductsTable';

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

export interface ProductFormType {
  name: string;
  logo: string;
  warehouse: string;
  slug: string;
  quantity: number;
  quantityAlert: number;
  category: string;
  brand: string;
  barcodeSymbology: string;
  itemCode: string;
  openingStock: number;
  openingStockDate: string;
  purchasePrice: number;
  salePrice: number;
  mrp: number;
  tax: string;
  expireDate?: string;
  description?: string;
}

const Index = () => {
  const router = useRouter();

  const products = trpc.productRouter.getAllProducts.useQuery();
  const deleteProduct = trpc.productRouter.delete.useMutation();
  if (products.isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Products</Title>
          <Button
            size='xs'
            onClick={() => {
              router.push('/products/add');
            }}
          >
            Add Product
          </Button>
        </Group>
        <Divider mt={'xl'} />
        <ProductTable
          data={
            products.data?.map((val) => ({
              ...val,
              id: val._id.toString(),
              warehouse: val.warehouse as unknown as string,
              category: val.category as unknown as string,
              brand: val.brand as unknown as string,
            })) || []
          }
          onDelete={(id) => {
            deleteProduct.mutateAsync({
              id,
            });
          }}
          onEdit={(id) => console.log(id)}
        />
      </div>
      {/* </Container> */}
    </Layout>
  );
};

export default Index;
