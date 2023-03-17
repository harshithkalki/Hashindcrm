import {
  Button,
  Center,
  Divider,
  Group,
  Pagination,
  Title,
  Image,
} from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';

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
  const [page, setPage] = React.useState(1);
  const products = trpc.productRouter.getProducts.useInfiniteQuery(
    {},
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      getNextPageParam: () => page,
    }
  );

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
        <TableSelection
          data={
            products.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
                warehouse: (val.warehouse as unknown as { name: string }).name,
                category: (val.category as unknown as { name: string }).name,
                brand: (val.brand as unknown as { name: string })
                  .name as unknown as string,
              })) ?? []
          }
          onEdit={(id) => console.log(id)}
          colProps={{
            name: {
              label: 'Name',
            },
            warehouse: {
              label: 'Warehouse',
            },
            category: {
              label: 'Category',
            },
            brand: {
              label: 'Brand',
            },
            mrp: {
              label: 'MRP',
            },
            purchasePrice: {
              label: 'Purchase Price',
            },
            salePrice: {
              label: 'Sale Price',
            },
            quantity: {
              label: 'Quantity',
            },
            quantityAlert: {
              label: 'Quantity Alert',
            },
          }}
          deletable
          editable
          onDelete={async (id) => {
            await deleteProduct.mutateAsync({
              id,
            });
          }}
        />
        <Center>
          {(products.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                products.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </div>
      {/* </Container> */}
    </Layout>
  );
};

export default Index;
