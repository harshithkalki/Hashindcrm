import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';
import { trpc } from '@/utils/trpc';
import { Group, Title, Center, Pagination } from '@mantine/core';
import React from 'react';

const Index = () => {
  const [page, setPage] = React.useState(1);

  const stockReport = trpc.reports.stockReport.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (!stockReport.data?.pages.find((pageData) => pageData?.page === page)) {
      stockReport.fetchNextPage();
    }
  }, [stockReport, page]);

  const data = React.useMemo(() => {
    const pageData = stockReport.data?.pages.find(
      (pageData) => pageData?.page === page
    );

    const products: {
      name: string;
      itemCode: string;
      unitsSold: number;
      _id: string;
    }[] = [];

    pageData?.docs.forEach((doc) => {
      doc.products.forEach((product) => {
        const currentProduct = products.find(
          (productData) =>
            productData._id === (product._id as unknown as { _id: string })?._id
        );

        if (currentProduct) {
          currentProduct.unitsSold += product.quantity;
        } else {
          if (product._id === null) {
            return;
          }

          products.push({
            name: (product._id as unknown as { name: string }).name,
            itemCode: (product._id as unknown as { itemCode: string }).itemCode,
            unitsSold: product.quantity,
            _id: (product._id as unknown as { _id: string })._id,
          });
        }
      });
    });

    return products;
  }, [stockReport.data, page]);

  return (
    <Layout>
      <Group mb={'xl'}>
        <Title fw={400}>Product Sales Summary</Title>
      </Group>
      <Center
        style={{
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <TableSelection
          data={data}
          colProps={{
            name: {
              label: 'Name',
            },
            itemCode: {
              label: 'Item Code',
            },
            unitsSold: {
              label: 'Units Sold',
            },
          }}
        />
      </Center>
      <Center>
        {(stockReport.data?.pages.find((pageData) => pageData?.page === page)
          ?.totalPages ?? 0) > 1 && (
          <Pagination
            total={
              stockReport.data?.pages.find(
                (pageData) => pageData?.page === page
              )?.totalPages ?? 0
            }
            initialPage={1}
            page={page}
            onChange={setPage}
          />
        )}
      </Center>
    </Layout>
  );
};

export default Index;
