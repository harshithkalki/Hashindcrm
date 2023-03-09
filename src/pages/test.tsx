import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Text } from '@mantine/core';
import Invoice from '@/components/Invoice';
const Example = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Invoice invoiceRef={componentRef} />
      <Button onClick={handlePrint}>Print this out!</Button>
    </div>
  );
};

export default Example;
