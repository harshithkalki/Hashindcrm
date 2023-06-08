import { trpc } from '@/utils/trpc';
import { Center, Flex, Pagination, ScrollArea } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import TableSelection from '../Tables';
import { useTranslation } from 'react-i18next';

const UPITable = () => {
  const [page, setPage] = React.useState(1);
  const UPIData = trpc.saleRouter.getUPISales.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false, cacheTime: 0 }
  );
  useEffect(() => {
    if (!UPIData.data?.pages.find((pageData) => pageData.page === page)) {
      UPIData.fetchNextPage();
    }
  }, [UPIData, page]);
  const { t } = useTranslation('common');

  console.log(UPIData.data);
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ScrollArea h={'90vh'} style={{ flex: '1' }}>
          <TableSelection
            data={
              UPIData.data?.pages
                .find((pageData) => pageData.page === page)
                ?.docs.map((doc, index) => ({
                  ...doc,
                  _id: doc._id.toString(),
                  date: dayjs(doc.date).format('DD MMMM YYYY'),
                  index: index + 10 * (page - 1) + 1,
                })) || []
            }
            colProps={{
              index: {
                label: `${t('sno')}`,
              },
              date: {
                label: `${t('date')}`,
              },
              invoiceId: {
                label: `${t('invoice id')}`,
              },
              customer: {
                label: `${t('customer')}`,
              },
              discount: {
                label: `${t('discount')}`,
              },
              shipping: {
                label: `${t('shipping')}`,
              },
              total: {
                label: `${t('total')}`,
              },
            }}
          />
          <Center>
            {(UPIData.data?.pages.find((pageData) => pageData.page === page)
              ?.totalPages ?? 0) > 1 && (
              <Pagination
                total={
                  UPIData.data?.pages.find((pageData) => pageData.page === page)
                    ?.totalPages ?? 0
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

export default UPITable;
