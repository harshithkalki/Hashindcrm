import CashandBankTable from '@/components/Tables/CashAndBankTable';
import { Group, Title } from '@mantine/core';
import React from 'react';
const cashData = [
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0001',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
  {
    paymentdate: '2021-01-01',
    referencenumber: 'INV-0002',
    paymenttype: 'Cash',
    user: 'John Doe',
    userprofile: 'https://i.pravatar.cc/150?img=1',
    modetype: 'Cash',
    amount: 1000,
  },
];

const Index = () => {
  return (
    <>
      <Group mb={'md'}>
        <Title fw={400}>Payments</Title>
      </Group>
      <CashandBankTable data={cashData} />
    </>
  );
};

export default Index;
