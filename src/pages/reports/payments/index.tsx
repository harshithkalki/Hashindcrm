import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import CashandBankTable from '@/components/Tables/CashAndBankTable';
import { trpc } from '@/utils/trpc';
import { Center, Group, Pagination, Title } from '@mantine/core';
import React from 'react';
const cashData = [
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0001',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
];

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

  return (
    <Layout>
      <Group mb={'md'}>
        <Title fw={400}>Payments</Title>
      </Group>
      {/* <CashandBankTable data={cashData} /> */}
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
        {(paymentReport.data?.pages.find((pageData) => pageData?.page === page)
          ?.totalPages ?? 0) > 1 && (
          <Pagination
            total={
              paymentReport.data?.pages.find(
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
    </Layout>
  );
};

export default Index;
