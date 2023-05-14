import {
  Button,
  Center,
  Group,
  Pagination,
  Title,
  Image,
  FileButton,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { client, trpc } from '@/utils/trpc';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { Container } from '@mantine/core';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MIME_TYPES } from '@mantine/dropzone';
import csvtojson from 'csvtojson';

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
  const createManyProducts = trpc.productRouter.createMany.useMutation();
  const [file, setFile] = React.useState<File | null>(null);

  useEffect(() => {
    if (!products.data?.pages.find((pageData) => pageData.page === page)) {
      products.fetchNextPage();
    }
  }, [products, page]);

  if (products.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
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
                const headers: Record<string, string> = {};
                if (data.length === 0) return;
                Object.keys(data[0]!).forEach((key) => {
                  headers[key as keyof (typeof data)[number]] = key;
                });
                exportCSVFile(headers, data, 'products');
              }}
            >
              Download CSV
            </Button>
            <FileButton
              onChange={(file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const csv = e.target?.result;
                  if (!csv) return;
                  const data = await csvtojson({
                    colParser: {
                      quantity: 'number',
                      quantityAlert: 'number',
                      openingStock: 'number',
                      purchasePrice: 'number',
                      salePrice: 'number',
                      mrp: 'number',
                      tax: 'number',
                    },
                  }).fromString(csv as string);
                  createManyProducts.mutateAsync(data);
                };
                reader.readAsText(file);
              }}
              accept={MIME_TYPES.csv}
            >
              {(props) => (
                <Button
                  {...props}
                  size='xs'
                  loading={createManyProducts.isLoading}
                >
                  Upload CSV
                </Button>
              )}
            </FileButton>
          </Group>
        </Group>
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
      </Container>
    </Layout>
  );
};

export default Index;
