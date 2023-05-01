import { Tabs } from '@mantine/core';
import React from 'react';
import SalesTableTab from './DashBoard/SalesTableTab';

import PurchasesTableTab from './DashBoard/PurchasesTableTab';
import PurchasesReturnTab from './DashBoard/PurchasesReturnsTab';
import SalesReturnsTab from './DashBoard/SalesReturnsTab';

const SaleandPurchasesDashboard = () => {
  return (
    <>
      <Tabs defaultValue={'sales'}>
        <Tabs.List>
          <Tabs.Tab value='sales'>Sales</Tabs.Tab>
          <Tabs.Tab value='purchases'>Purchases</Tabs.Tab>
          <Tabs.Tab value='salesReturns'>Sales Returns</Tabs.Tab>
          <Tabs.Tab value='purchasesReturns'>Purchases Returns</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='sales'>
          <SalesTableTab />
        </Tabs.Panel>
        <Tabs.Panel value='purchases'>
          <PurchasesTableTab />
        </Tabs.Panel>
        <Tabs.Panel value='salesReturns'>
          <SalesReturnsTab />
        </Tabs.Panel>
        <Tabs.Panel value='purchasesReturns'>
          <PurchasesReturnTab />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default SaleandPurchasesDashboard;
