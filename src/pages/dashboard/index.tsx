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
                title: 'UPI',
                stats: data.salesByPaymentMode.totalSalesUpi.toFixed(0),
                description: 'Upi Monthly turnover',
              },
              {
                title: 'Bank',
                stats: data.salesByPaymentMode.totalSalesCash.toFixed(0),
                description: 'Bank Monthly turnover',
              },
              {
                title: 'Cash',
                stats: data.salesByPaymentMode.totalSalesBank.toFixed(0),
                description: 'Cash Monthly turnover',
              },
            ]}
          />

          <StatsGrid
            data={[
              {
                title: 'Total Sales',
                icon: 'sales',
                value: Rupee + ' ' + data.totalSales.toFixed(0),
              },
              {
                title: 'Total Expenses',
                icon: 'expenses',
                value: Rupee + ' ' + data.totalExpense.toFixed(0),
              },
              {
                title: 'Payments Sent',
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
                    title: 'Total sale items',
                    value: data.totalSaleItems.toFixed(0),
                  },
                  {
                    title: 'Total sale return items',
                    value: data.totalSaleReturnItems.toFixed(0),
                  },
                  {
                    title: 'Total purchase items',
                    value: data.totalPurchaseItems.toFixed(0),
                  },
                  {
                    title: 'Total purchase return items',
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
