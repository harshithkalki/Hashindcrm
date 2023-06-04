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
import React from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const stockalerts = trpc.reports.stockAlerts.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (!stockalerts.data?.pages.find((pageData) => pageData.page === page)) {
      stockalerts.fetchNextPage();
    }
  }, [stockalerts, page]);

  const { t } = useTranslation('common');

  return (
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
        searchable={false}
      />
      <Center>
        {(stockalerts.data?.pages.find((pageData) => pageData?.page === page)
          ?.totalPages ?? 0) > 1 && (
          <Pagination
            total={
              stockalerts.data?.pages.find(
                (pageData) => pageData?.page === page
              )?.totalPages ?? 0
            }
            initialPage={1}
            // {...pagination}
            page={page}
            onChange={setPage}
          />
        )}
      </Center>
    </Container>
  );
};

export default Index;
