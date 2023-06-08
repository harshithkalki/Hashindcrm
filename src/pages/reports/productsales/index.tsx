import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Group, Title, Center, Pagination, Container } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const stockReport = trpc.reports.stockReport.useQuery();
  const [page, setPage] = React.useState(1);

  const { t } = useTranslation('common');

  const data = React.useMemo(() => {
    const pageData = stockReport.data;

    const products: {
      name: string;
      itemCode: string;
      unitsSold: number;
      _id: string;
    }[] = [];

    pageData?.forEach((doc) => {
      doc.products.forEach((product) => {
        const currentProduct = products.find(
          (productData) =>
            productData._id === (product._id as unknown as { _id: string })?._id
        );

        if (currentProduct) {
          currentProduct.unitsSold += product.quantity;
        } else {
          if (product._id === null) {
            return;
          }

          products.push({
            name: (product._id as unknown as { name: string }).name,
            itemCode: (product._id as unknown as { itemCode: string }).itemCode,
            unitsSold: product.quantity,
            _id: (product._id as unknown as { _id: string })._id,
          });
        }
      });
    });

    return products;
  }, [stockReport.data]);

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my={'lg'}>
          <Title fw={400}>{t('product sales summary')}</Title>
        </Group>
        <Center
          style={{
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <TableSelection
            data={
              data?.slice((page - 1) * 10, page * 10)?.map((doc, index) => ({
                ...doc,
                index: index + 10 * (page - 1) + 1,
              })) ?? []
            }
            colProps={{
              index: {
                label: `${t('sno')}`,
              },
              name: {
                label: `${t('name')}`,
              },
              itemCode: {
                label: `${t('item code')}`,
              },
              unitsSold: {
                label: `${t('units sold')}`,
              },
            }}
          />
        </Center>
        <Center>
          {(data?.length ?? 0) > 1 && (
            <Pagination
              total={Math.floor((data?.length ?? 0) / 10)}
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
