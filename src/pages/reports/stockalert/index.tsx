import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Center,
  Image,
  Pagination,
  Container,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const stockalerts = trpc.reports.stockAlerts.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  const { t } = useTranslation('common');

  React.useEffect(() => {
    if (!stockalerts.data?.pages.find((pageData) => pageData.page === page)) {
      stockalerts.fetchNextPage();
    }
  }, [stockalerts, page]);

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my={'lg'}>
          <Title fw={400}>{t('stock alert')}</Title>
        </Group>
        <TableSelection
          data={
            stockalerts.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
              })) || []
          }
          colProps={{
            logo: {
              label: `${t('logo')}`,
              Component: ({ data: { logo } }) => (
                <Group spacing='xs' position='center'>
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
            itemCode: {
              label: `${t('item code')}`,
            },
            quantity: {
              label: `${t('current stock')}`,
            },
            quantityAlert: {
              label: `${t('quantity alert')}`,
            },
          }}
        />
        <Center>
          {(stockalerts.data?.pages.find((pageData) => pageData?.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={stockalerts.data?.pages.length ?? 0}
              initialPage={1}
              // {...pagination}
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
