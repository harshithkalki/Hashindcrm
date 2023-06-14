import { trpc } from '@/utils/trpc';
import {
  Center,
  Flex,
  Loader,
  Pagination,
  ScrollArea,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import TableSelection from '../Tables';
import { useTranslation } from 'react-i18next';

const CardTable = () => {
  const [page, setPage] = React.useState(1);
  const CardData = trpc.saleRouter.getCardSales.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!CardData.data?.pages.find((pageData) => pageData.page === page)) {
      CardData.fetchNextPage();
    }
  }, [CardData, page]);
  const { t } = useTranslation('common');

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
                  ?.docs.map((doc, index) => ({
                    ...doc,
                    _id: doc._id.toString(),
                    date: dayjs(doc.date).format('DD MMMM YYYY'),
                    index: index + 10 * (page - 1) + 1,
                    customer: doc.customer?.name ?? 'N/A',
                    total: Math.round(doc.total),
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
              {(CardData.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages ?? 0) > 1 && (
                <Pagination
                  total={
                    CardData.data?.pages.find(
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
      )}
    </>
  );
};

export default CardTable;
