import { Tabs } from '@mantine/core';
import React from 'react';
import SalesTableTab from './DashBoard/SalesTableTab';

import PurchasesTableTab from './DashBoard/PurchasesTableTab';
import PurchasesReturnTab from './DashBoard/PurchasesReturnsTab';
import SalesReturnsTab from './DashBoard/SalesReturnsTab';
import { useTranslation } from 'react-i18next';

const SaleandPurchasesDashboard = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Tabs defaultValue={'sales'}>
        <Tabs.List>
          <Tabs.Tab value='sales'>{t('sales')}</Tabs.Tab>
          <Tabs.Tab value='purchases'>{t('purchase')}</Tabs.Tab>
          <Tabs.Tab value='salesReturns'>{t('sales returns')}</Tabs.Tab>
          <Tabs.Tab value='purchasesReturns'>{t('purchase return')}</Tabs.Tab>
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
