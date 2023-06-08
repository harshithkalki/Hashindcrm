import { Tabs } from '@mantine/core';
import React from 'react';
import SalesTableTab from './DashBoard/SalesTableTab';

import PurchasesTableTab from './DashBoard/PurchasesTableTab';
import PurchasesReturnTab from './DashBoard/PurchasesReturnsTab';
import SalesReturnsTab from './DashBoard/SalesReturnsTab';
import { useTranslation } from 'react-i18next';

const SaleandPurchasesDashboard = ({
  date,
}: {
  date: {
    from: Date | null;
    to: Date | null;
  };
}) => {
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
          <SalesTableTab date={date} />
        </Tabs.Panel>
        <Tabs.Panel value='purchases'>
          <PurchasesTableTab date={date} />
        </Tabs.Panel>
        <Tabs.Panel value='salesReturns'>
          <SalesReturnsTab date={date} />
        </Tabs.Panel>
        <Tabs.Panel value='purchasesReturns'>
          <PurchasesReturnTab date={date} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default SaleandPurchasesDashboard;
