import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import {
  Center,
  Flex,
  Group,
  Pagination,
  ScrollArea,
  Title,
} from '@mantine/core';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const sales = trpc.reports.sales.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  const { t } = useTranslation('common');

  React.useEffect(() => {
    if (!sales.data?.pages.find((pageData) => pageData?.page === page)) {
      sales.fetchNextPage();
    }
  }, [sales, page]);
  return (
    <Layout>
      <Flex
        style={{
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <ScrollArea>
          <Group mb={'lg'}>
            <Title fw={400}>{t('sales report')}</Title>
          </Group>
          <TableSelection
            data={
              sales.data?.pages
                .find((pageData) => pageData?.page === page)
                ?.docs.map((doc, index) => ({
                  ...doc,
                  _id: doc._id.toString(),
                  customer: (doc.customer as unknown as { name: string }).name,
                  staffMem:
                    (doc.staffMem as unknown as { name: string })?.name ?? '',
                  index: index + 10 * (page - 1) + 1,
                })) || []
            }
            colProps={{
              index: {
                label: `${t('sno')}`,
              },
              createdAt: {
                label: 'Payment Date',
              },
              invoiceId: {
                label: `${t('reference no')}`,
              },
              customer: {
                label: `${t('user')}`,
              },
              total: {
                label: 'Amount',
              },
              status: {
                label: `${t('payment status')}`,
              },
              staffMem: {
                label: `${t('created by')}`,
              },
            }}
          />
          <Center>
            {(sales.data?.pages.find((pageData) => pageData?.page === page)
              ?.totalPages ?? 0) > 1 && (
              <Pagination
                total={
                  sales.data?.pages.find((pageData) => pageData?.page === page)
                    ?.totalPages ?? 0
                }
                initialPage={1}
                page={page}
                onChange={setPage}
              />
            )}
          </Center>
        </ScrollArea>
      </Flex>
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
