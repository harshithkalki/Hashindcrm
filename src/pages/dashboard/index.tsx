import Graph from '@/components/Graph';
import Layout from '@/components/Layout';
import { LoadingScreen } from '@/components/LoadingScreen';
import SaleandPurchasesDashboard from '@/components/SaleandPurchasesDashboard';
import { StatsGrid } from '@/components/StatsGrid';
import { StatsHistroy } from '@/components/StatsGrid/StatsHistroy';
import { StatsGroup } from '@/components/StatsGroup';
import { StatsSegments } from '@/components/StatsSegment';
import StockAlertDashboard from '@/components/StockAlertDashboard';
import { Rupee } from '@/constants';
import { trpc } from '@/utils/trpc';
import type { DefaultMantineColor } from '@mantine/core';
import { Flex, Grid, ScrollArea, useMantineTheme } from '@mantine/core';
import React from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

const colorsNames: DefaultMantineColor[] = [
  'blue',
  'red',
  'yellow',
  'violet',
  'teal',
  'gray',
];

const Index = () => {
  const { data, isLoading } = trpc.daashboardRouter.dashboard.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );
  const { colors } = useMantineTheme();
  const { t } = useTranslation('common');

  const top5SellingProducts = React.useMemo(() => {
    if (!data) return null;

    let remaining = data.totalSaleItems;

    const values = data.top5SellingProducts.map((item, index) => {
      remaining = remaining - item.totalQuantity;

      return {
        label: item.name,
        count: item.totalQuantity.toFixed(0),
        part: parseInt(
          ((item.totalQuantity / data.totalSaleItems) * 100).toFixed(0)
        ),
        color: colors[colorsNames[index]!]![6],
      };
    });

    if (remaining <= 0) return values;

    values.push({
      label: 'Others',
      count: remaining.toFixed(0),
      part: parseInt(((remaining / data.totalSaleItems) * 100).toFixed(0)),
      color: colors[colorsNames[5]!]![6],
    });

    return values;
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data) return null;

  return (
    <Layout>
      <Flex
        style={{
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <ScrollArea>
          <StatsGroup
            data={[
              {
                title: `${t('upi')}`,
                stats: data.salesByPaymentMode.totalSalesUpi.toFixed(0),
                description: 'Upi Monthly turnover',
              },
              {
                title: `${t('bank')}`,
                stats: data.salesByPaymentMode.totalSalesCash.toFixed(0),
                description: 'Bank Monthly turnover',
              },
              {
                title: `${t('upi')}`,
                stats: data.salesByPaymentMode.totalSalesBank.toFixed(0),
                description: 'Cash Monthly turnover',
              },
            ]}
          />

          <StatsGrid
            data={[
              {
                title: `${t('total sales')}`,
                icon: 'sales',
                value: Rupee + ' ' + data.totalSales.toFixed(0),
              },
              {
                title: `${t('total expenses')}`,
                icon: 'expenses',
                value: Rupee + ' ' + data.totalExpense.toFixed(0),
              },
              {
                title: `${t('payments sent')}`,
                icon: 'payments',
                value: Rupee + ' ' + data.totalPurchase.toFixed(0),
              },
            ]}
          />

          <Grid columns={4} mr={'sm'} ml={'sm'}>
            <Grid.Col span={1}>
              <StatsSegments data={top5SellingProducts ?? []} />
            </Grid.Col>
            <Grid.Col span={3}>
              <Graph
                data={data.salesPerMonth.map((quantity, index) => ({
                  name: dayjs().month(index).format('MMM'),
                  purchase: data.purchasesPerMonth[index]?.toFixed(0) ?? '0',
                  sale: quantity.toFixed(0),
                }))}
              />
            </Grid.Col>
            <Grid.Col span={1} mt={'md'}>
              <StatsHistroy
                data={[
                  {
                    title: `${t('total sale items')}`,
                    value: data.totalSaleItems.toFixed(0),
                  },
                  {
                    title: `${t('total sale returns')}`,
                    value: data.totalSaleReturnItems.toFixed(0),
                  },
                  {
                    title: `${t('total purchase items')}`,
                    value: data.totalPurchaseItems.toFixed(0),
                  },
                  {
                    title: `${t('total purchase returns')}`,
                    value: data.totalPurchaseReturnItems.toFixed(0),
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={3} mt={'md'}>
              <SaleandPurchasesDashboard />
            </Grid.Col>
            <Grid.Col span={3} h={300}>
              <StockAlertDashboard />
            </Grid.Col>
          </Grid>
        </ScrollArea>
      </Flex>
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
