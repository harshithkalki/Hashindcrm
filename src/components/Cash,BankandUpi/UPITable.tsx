import { trpc } from '@/utils/trpc';
import { Flex, Pagination, ScrollArea } from '@mantine/core';
import React, { useEffect } from 'react';
import TableSelection from '../Tables';

const UPITable = () => {
  const [page, setPage] = React.useState(1);
  const UPIData = trpc.saleRouter.getUPISales.useInfiniteQuery(
    { limit: 8 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!UPIData.data?.pages.find((pageData) => pageData.page === page)) {
      UPIData.fetchNextPage();
    }
  }, [UPIData, page]);

  console.log(UPIData.data);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ScrollArea h={'90vh'} style={{ flex: '1' }}>
          <TableSelection
            data={
              UPIData.data?.pages
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
              UPIData.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages || 0
            }
            initialPage={1}
            page={page}
            onChange={setPage}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default UPITable;
