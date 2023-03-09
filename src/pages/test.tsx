import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Text } from '@mantine/core';
import Invoice from '@/components/Invoice';
import { trpc } from '@/utils/trpc';

const Example = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const invoice = trpc.saleRouter.getInvoice.useQuery({
    _id: '640a2b60036101cb165ad067',
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!invoice.data) {
    return <Text>Loading...</Text>;
  }

  return (
    <div>
      <div style={{ display: 'none' }}>
        <Invoice invoiceRef={componentRef} data={invoice.data} />
      </div>
      <Button onClick={handlePrint}>Print this out!</Button>
    </div>
  );
};

export default Example;
