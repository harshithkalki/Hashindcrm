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
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  const { t } = useTranslation('common');

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
          <Title fw={400}>{t('products')}</Title>
          <Group>
            <Button
              size='xs'
              onClick={() => {
                router.push('/products/add');
              }}
            >
              {t('add product')}
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
              {t('export csv')}
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
                  {t('upload csv')}
                </Button>
              )}
            </FileButton>
          </Group>
        </Group>
        <TableSelection
          data={
            products.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val, index) => ({
                ...val,
                _id: val._id.toString(),
                warehouse: (val.warehouse as unknown as { name: string }).name,
                category: (val.category as unknown as { name: string }).name,
                brand: (val.brand as unknown as { name: string })
                  .name as unknown as string,
                index: index + 10 * (page - 1) + 1,
              })) ?? []
          }
          onEdit={(id) => {
            router.push(`/products/edit/${id}`);
          }}
          colProps={{
            index: {
              label: `${t('sno')}`,
            },
            logo: {
              label: `${t('logo')}`,
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
              label: `${t('name')}`,
            },
            warehouse: {
              label: `${t('warehouse')}`,
            },
            category: {
              label: `${t('category')}`,
            },
            brand: {
              label: `${t('brand')}`,
            },
            mrp: {
              label: `${t('mrp')}`,
            },
            purchasePrice: {
              label: `${t('purchase price')}`,
            },
            salePrice: {
              label: `${t('sale price')}`,
            },
            quantity: {
              label: `${t('quantity')}`,
            },
            quantityAlert: {
              label: `${t('quantity alert')}`,
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
