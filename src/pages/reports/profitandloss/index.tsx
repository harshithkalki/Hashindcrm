import { Group, Table, Title } from '@mantine/core';
import React from 'react';

const index = () => {
  const data = {
    sales: 0,
    purchases: 0,
    expenses: 0,
    profit: 0,
    purchaseReturn: 0,
    salesReturn: 0,
  };

  return (
    <>
      <Group>
        <Title fw={400}>Profit and Loss</Title>
      </Group>

      <Table
        w={'98%'}
        mt={'xl'}
        ml='lg'
        mr={'lg'}
        horizontalSpacing='md'
        verticalSpacing='xs'
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
        striped
        withBorder
        withColumnBorders
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Particulars</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sales</td>
            <td>{data.sales}</td>
          </tr>
          <tr>
            <td>Purchases</td>
            <td>{data.purchases}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td>{data.expenses}</td>
          </tr>
          <tr>
            <td>Profit</td>
            <td>{data.profit}</td>
          </tr>
          <tr>
            <td>Purchase Return</td>
            <td>{data.purchaseReturn}</td>
          </tr>
          <tr>
            <td>Sales Return</td>
            <td>{data.salesReturn}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default index;