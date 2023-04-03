import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Center, Group, Pagination, Title } from '@mantine/core';
import React from 'react';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const sales = trpc.reports.sales.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (!sales.data?.pages.find((pageData) => pageData?.page === page)) {
      sales.fetchNextPage();
    }
  }, [sales, page]);

  return (
    <Layout>
      <Group mb={'lg'}>
        <Title fw={400}>Sales Report</Title>
      </Group>
      <TableSelection
        data={
          sales.data?.pages
            .find((pageData) => pageData?.page === page)
            ?.docs.map((doc) => ({
              ...doc,
              _id: doc._id.toString(),
              customer: (doc.customer as unknown as { name: string }).name,
              staffMem:
                (doc.staffMem as unknown as { name: string })?.name ?? '',
            })) || []
        }
        colProps={{
          createdAt: {
            label: 'Payment Date',
          },
          invoiceId: {
            label: 'Reference No',
          },
          customer: {
            label: 'User',
          },
          total: {
            label: 'Amount',
          },
          status: {
            label: 'Payment Status',
          },
          staffMem: {
            label: 'Created By',
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
    </Layout>
  );
};

export default Index;
