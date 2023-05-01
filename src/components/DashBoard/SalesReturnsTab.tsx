import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Pagination, Center, Container } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import _ from 'lodash';

const Index = () => {
  const [page, setPage] = useState(1);
  const sales = trpc.saleReturnRouter.returns.useInfiniteQuery(
    {
      limit: 6,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (!sales.data?.pages.find((pageData) => pageData.page === page)) {
      sales.fetchNextPage();
    }
  }, [sales, page]);

  return (
    <>
      <Container
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <TableSelection
          data={
            sales.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
                date: dayjs(val.date).format('DD MMMM YYYY'),
                customer: _.get(val, 'customer.name', 'Walk-in Customer'),
                total: val.total.toFixed(),
              })) ?? []
          }
          colProps={{
            date: {
              label: 'Date',
            },
            customer: {
              label: 'Customer',
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
          {(sales.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                sales.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
              size='md'
            />
          )}
        </Center>
      </Container>
    </>
  );
};

export default Index;
