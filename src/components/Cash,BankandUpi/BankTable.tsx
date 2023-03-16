import { trpc } from '@/utils/trpc';
import { Center, Flex, Loader, Pagination, ScrollArea } from '@mantine/core';
import React, { useEffect } from 'react';
import TableSelection from '../Tables';

const CardTable = () => {
  const [page, setPage] = React.useState(1);
  const CardData = trpc.saleRouter.getCardSales.useInfiniteQuery(
    { limit: 8 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!CardData.data?.pages.find((pageData) => pageData.page === page)) {
      CardData.fetchNextPage();
    }
  }, [CardData, page]);

  console.log(CardData.data);
  return (
    <>
      {CardData.isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ScrollArea h={'90vh'} style={{ flex: '1' }}>
            <TableSelection
              data={
                CardData.data?.pages
                  .find((pageData) => pageData.page === page)
                  ?.docs.map((doc) => ({
                    ...doc,
                    _id: doc._id.toString(),
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
                  label: 'Total',
                },
              }}
            />
            <Pagination
              total={
                CardData.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages || 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default CardTable;
