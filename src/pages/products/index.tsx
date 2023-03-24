import {
  Button,
  Center,
  Divider,
  Group,
  Pagination,
  Title,
  Image,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { client, trpc } from '@/utils/trpc';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { exportCSVFile } from '@/utils/jsonTocsv';

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

  useEffect(() => {
    if (!products.data?.pages.find((pageData) => pageData.page === page)) {
      products.fetchNextPage();
    }
  }, [products, page]);

  if (products.isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Products</Title>
          <Group>
            <Button
              size='xs'
              onClick={() => {
                router.push('/products/add');
              }}
            >
              Add Product
            </Button>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.productRouter.getCsv.query();
                const headers: Record<keyof typeof data[number], string> = {
                  name: 'Name',
                  warehouse: 'Warehouse',
                  _id: 'ID',
                  company: 'Company',
                  createdAt: 'Created At',
                  description: 'Description',
                  slug: 'Slug',
                  logo: 'Logo',
                  quantity: 'Quantity',
                  quantityAlert: 'Quantity Alert',
                  category: 'Category',
                  brand: 'Brand',
                  barcodeSymbology: 'Barcode Symbology',
                  itemCode: 'Item Code',
                  openingStock: 'Opening Stock',
                  openingStockDate: 'Opening Stock Date',
                  purchasePrice: 'Purchase Price',
                  salePrice: 'Sale Price',
                  tax: 'Tax',
                  mrp: 'MRP',
                  expiryDate: 'Expiry Date',
                  warehouseId: 'Warehouse ID',
                  categoryId: 'Category ID',
                  brandId: 'Brand ID',
                };

                exportCSVFile(headers, data, 'products');
              }}
            >
              Download CSV
            </Button>
          </Group>
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
          onEdit={(id) => {
            router.push(`/products/edit/${id}`);
          }}
          colProps={{
            logo: {
              label: 'Logo',
              Component: ({ data: { logo } }) => (
                <Group spacing='xs'>
                  <Image
                    src={logo}
                    alt={'logo'}
                    radius='lg'
                    style={{ width: 32, height: 32 }}
                    withPlaceholder
                  />
                </Group>
              ),
            },
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
            // need to fix this logic
            console.log(products.data?.pages[page]?.docs.length);
            if (page > 1 && products.data?.pages[page]?.docs.length === 1)
              setPage((page) => page - 1);

            await products.refetch();
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
