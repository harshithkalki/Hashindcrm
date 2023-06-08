import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Pagination, Center, Container } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const Index = ({
  date,
}: {
  date: {
    from: Date | null;
    to: Date | null;
  };
}) => {
  const [page, setPage] = useState(1);

  const purchases = trpc.purchaseRouter.purchases.useInfiniteQuery(
    {
      limit: 6,
      startDate: date.from?.toISOString() ?? undefined,
      endDate: date.to?.toISOString() ?? undefined,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (!purchases.data?.pages.find((pageData) => pageData.page === page)) {
      purchases.fetchNextPage();
    }
  }, [purchases, page]);

  return (
    <>
      <Container
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <TableSelection
          data={
            purchases.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
                date: dayjs(val.date).format('DD MMMM YYYY'),
                supplier: (val.supplier as unknown as { name: string }).name,
              })) || []
          }
          colProps={{
            invoiceId: {
              label: 'Invoice ID',
            },
            date: {
              label: 'Date',
            },
            supplier: {
              label: 'Supplier',
            },
            status: {
              label: 'Payment Status',
            },
            total: {
              label: 'Total Amount',
            },
          }}
          searchable={false}
        />
        <Center>
          {(purchases.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                purchases.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
              size={'md'}
            />
          )}
        </Center>
      </Container>
    </>
  );
};

export default Index;
