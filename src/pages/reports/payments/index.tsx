import Layout from '@/components/Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Center, Container, Group, Pagination, Title } from '@mantine/core';
import React from 'react';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const paymentReport = trpc.reports.paymentsReport.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (
      !paymentReport.data?.pages.find((pageData) => pageData?.page === page)
    ) {
      paymentReport.fetchNextPage();
    }
  }, [paymentReport, page]);

  if (paymentReport.isLoading) return <LoadingScreen />;
  console.log(paymentReport.data);

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg'>
          <Title fw={400}>Payments</Title>
        </Group>

        <TableSelection
          data={
            paymentReport.data?.pages
              .find((pageData) => pageData?.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
              })) || []
          }
          colProps={{
            paymentDate: {
              label: 'Payment Date',
            },

            referenceNo: {
              label: 'Reference Number',
            },
            paymentType: {
              label: 'Payment Type',
            },
            user: {
              label: 'User',
            },

            type: {
              label: 'Type',
            },
            amount: {
              label: 'Amount',
            },
          }}
        />
        <Center>
          {(paymentReport.data?.pages.find(
            (pageData) => pageData?.page === page
          )?.totalPages ?? 0) > 1 && (
            <Pagination
              total={paymentReport.data?.pages.length ?? 0}
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
