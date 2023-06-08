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
  ScrollArea,
  Container,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const stockReport = trpc.reports.stockReport.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [page, setPage] = React.useState(1);

  const data = React.useMemo(() => {
    const pageData = stockReport.data;
    if (!pageData) {
      return [];
    }

    const product = new Map<string, StockReport>();

    pageData.forEach((doc) => {
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
  }, [stockReport.data]);

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

  const rows = filteredData
    .slice((page - 1) * 10, page * 10)
    .map((item, index) => {
      return (
        <tr key={item.id}>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {index + 10 * (page - 1) + 1}
          </td>
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

  const { t } = useTranslation('common');

  return (
    <Layout>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('stock summary')}</Title>
        </Group>

        <TextInput
          placeholder='Search by any field'
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <ScrollArea style={{ flex: 1 }} w='100%'>
          <Container h='100%' w={'100%'}>
            <Table>
              <thead>
                <tr>
                  <th>{t('sno')}</th>
                  <th>{t('name')}</th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('item code')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('category')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('brand')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('purchase price')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('sale price')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('current stock')}
                  </th>
                  <th
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                    colSpan={2}
                  >
                    {t('stock value')}
                  </th>
                </tr>
                <tr>
                  <th
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                    colSpan={7}
                  ></th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('purchase')}
                  </th>
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {t('sales')}
                  </th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Container>
        </ScrollArea>
        <Center>
          {(data?.length ?? 0) > 1 && (
            <Pagination
              total={Math.floor((data?.length ?? 0) / 10)}
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
