import Graph from '@/components/Graph';
import Layout from '@/components/Layout';
import SaleandPurchasesDashboard from '@/components/SaleandPurchasesDashboard';
import { StatsGrid } from '@/components/StatsGrid';
import { StatsHistroy } from '@/components/StatsGrid/StatsHistroy';
import { StatsGroup } from '@/components/StatsGroup';
import { StatsSegments } from '@/components/StatsSegment';
import StockAlertDashboard from '@/components/StockAlertDashboard';
import { Flex, Grid, ScrollArea, SimpleGrid, Tabs } from '@mantine/core';
import React from 'react';

const index = () => {
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
                stats: '100',
                description: 'Upi Monthly turnover',
              },
              {
                title: 'Bank',
                stats: '100',
                description: 'Bank Monthly turnover',
              },
              {
                title: 'Cash',
                stats: '100',
                description: 'Cash Monthly turnover',
              },
            ]}
          />

          <StatsGrid
            data={[
              {
                title: 'Total Sales',
                icon: 'sales',
                value: '$ 25,000',
              },
              {
                title: 'Total Expenses',
                icon: 'expenses',
                value: '$ 5,000',
              },
              {
                title: 'Payments Sent',
                icon: 'payments',
                value: '$ 20,000',
              },
              {
                title: 'Payments Received',
                icon: 'paymentsRecived',
                value: '$ 10,000',
              },
            ]}
          />

          <Grid columns={4} mr={'sm'} ml={'sm'}>
            <Grid.Col span={1}>
              <StatsSegments
                data={[
                  {
                    label: 'sunroof',
                    count: '1000',
                    part: 40,
                    color: '#47d6ab',
                  },
                  {
                    label: 'Doors',
                    count: '500',
                    part: 20,
                    color: '#fca130',
                  },
                  {
                    label: 'Wheels',
                    count: '500',
                    part: 20,
                    color: '#f93e3e',
                  },
                  {
                    label: 'Engine',
                    count: '500',
                    part: 20,
                    color: '#a3a0fb',
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Graph
                data={[
                  {
                    name: 'Jan',
                    purchase: 4000,
                    sale: 2400,
                  },
                  {
                    name: 'Feb',
                    purchase: 3000,
                    sale: 1398,
                  },
                  {
                    name: 'Mar',
                    purchase: 2000,
                    sale: 9800,
                  },
                  {
                    name: 'Apr',
                    purchase: 2780,
                    sale: 3908,
                  },
                  {
                    name: 'May',
                    purchase: 1890,
                    sale: 4800,
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={1} mt={'md'}>
              <StatsHistroy
                data={[
                  {
                    title: 'Total sale items',
                    value: '1000',
                  },
                  {
                    title: 'Total sale return items',
                    value: '1000',
                  },
                  {
                    title: 'Total purchase items',
                    value: '1000',
                  },
                  {
                    title: 'Total purchase return items',
                    value: '1000',
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

export default index;
