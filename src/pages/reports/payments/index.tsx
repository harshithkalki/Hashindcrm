import Layout from '@/components/Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Center, Container, Group, Pagination, Title } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';

const Index = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = trpc.reports.paymentsReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg'>
          <Title fw={400}>Payments</Title>
        </Group>

        <TableSelection
          data={
            data?.slice((page - 1) * 10, page * 10)?.map((doc) => ({
              ...doc,
              _id: doc._id.toString(),
            })) || []
          }
          colProps={{
            paymentDate: {
              label: 'Payment Date',
              Component: (props) => (
                <>{dayjs(props.data.paymentDate).format('MMMM DD, YYYY')}</>
              ),
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
              Component: (props) => <>{Math.round(props.data.amount)}</>,
            },
          }}
        />
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
