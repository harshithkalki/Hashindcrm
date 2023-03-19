import { trpc } from '@/utils/trpc';
import { Center, Flex, Pagination, ScrollArea } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import TableSelection from '../Tables';

const CashTable = () => {
  const [page, setPage] = React.useState(1);
  const cashData = trpc.saleRouter.getCashSales.useInfiniteQuery(
    { limit: 8 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!cashData.data?.pages.find((pageData) => pageData.page === page)) {
      cashData.fetchNextPage();
    }
  }, [cashData, page]);

  console.log(cashData.data);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ScrollArea h={'90vh'} style={{ flex: '1' }}>
          <TableSelection
            data={
              cashData.data?.pages
                .find((pageData) => pageData.page === page)
                ?.docs.map((doc) => ({
                  ...doc,
                  _id: doc._id.toString(),
                  date: dayjs(doc.date).format('DD MMMM YYYY'),
                })) || []
            }
            colProps={{
              date: {
                label: 'Date',
              },
              invoiceId: {
                label: 'Invoice Id',
              },
              customer: {
                label: 'Customer',
              },
              discount: {
                label: 'Discount',
              },
              shipping: {
                label: 'Shipping',
              },
              total: {
                label: 'Amount Paid',
              },
            }}
          />
          <Center>
            {(cashData.data?.pages.find((pageData) => pageData.page === page)
              ?.totalPages ?? 0) > 1 && (
              <Pagination
                total={
                  cashData.data?.pages.find(
                    (pageData) => pageData.page === page
                  )?.totalPages ?? 0
                }
                initialPage={1}
                page={page}
                onChange={setPage}
              />
            )}
          </Center>
        </ScrollArea>
      </div>
    </>
  );
};

export default CashTable;
