import Layout from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import {
  Group,
  Title,
  Image,
  TextInput,
  Table,
  Center,
  Pagination,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { useState } from 'react';

type StockReport = {
  id: string;
  name: string;
  logo: string;
  itemCode: string;
  category: string;
  brand: string;
  purchasePrice: number;
  salesPrice: number;
  currentStock: number;
  stockvaluebypurchase: number;
  stockvaluebysales: number;
};

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

    if (!pageData) {
      return [];
    }

    const product = new Map<string, StockReport>();

    pageData.docs.forEach((doc) => {
      doc.products.forEach((productDoc) => {
        const id = (
          productDoc._id as unknown as { _id: string }
        )?._id.toString();

        if (!id) return;

        const existingProduct = product.get(id);
        const isSale = 'customer' in doc;
        if (existingProduct) {
          product.set(id, {
            ...existingProduct,
            stockvaluebypurchase: !isSale
              ? existingProduct.stockvaluebypurchase
              : existingProduct.stockvaluebypurchase + productDoc.price,
            stockvaluebysales: isSale
              ? existingProduct.stockvaluebysales
              : existingProduct.stockvaluebysales + productDoc.price,
          });
        } else {
          product.set(id, {
            id,
            name: (productDoc._id as unknown as { name: string }).name,
            logo: (productDoc._id as unknown as { logo: string }).logo,
            itemCode: (productDoc._id as unknown as { itemCode: string })
              .itemCode,
            category: (productDoc._id as unknown as { category: string })
              .category,
            brand: (productDoc._id as unknown as { brand: string }).brand,
            purchasePrice: (
              productDoc._id as unknown as { purchasePrice: number }
            ).purchasePrice,
            salesPrice: (productDoc._id as unknown as { salePrice: number })
              .salePrice,
            currentStock: productDoc.quantity,
            stockvaluebypurchase: !isSale ? productDoc.price : 0,
            stockvaluebysales: isSale ? productDoc.price : 0,
          });
        }
      });
    });

    const data = Array.from(product.values());

    return data;
  }, [stockReport.data, page]);

  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((field) =>
          String(field)
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim())
        )
      )
    );
  };

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const rows = filteredData.map((item) => {
    return (
      <tr key={item.id}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Group spacing='xs'>
            <Image
              src={item.logo}
              alt={item.name}
              radius='lg'
              style={{ width: 25, height: 25 }}
            />
            {item.name}
          </Group>
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.itemCode}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.category}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.brand}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.purchasePrice}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.salesPrice}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.currentStock}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.stockvaluebypurchase}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.stockvaluebysales}
        </td>
      </tr>
    );
  });

  return (
    <Layout>
      <Group mb={'xl'}>
        <Title fw={400}>Stock Summary</Title>
      </Group>
      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Center>
        <Table w={'90%'} verticalSpacing='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Item Code
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Category
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Brand
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Purchase Price
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sale Price
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Current Stock
              </th>
              <th
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                colSpan={2}
              >
                Stock Value
              </th>
            </tr>
            <tr>
              <th
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                colSpan={7}
              ></th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Purchase
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sale
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
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
