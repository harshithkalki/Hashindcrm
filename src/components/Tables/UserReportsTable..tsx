import { useState } from 'react';
import { Center } from '@mantine/core';
import { Table, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

interface SubTableProps {
  purchase: number;
  sales: number;
  purchaseReturn: number;
  salesReturn: number;
}

interface Transfer {
  name: string;
  subTable: SubTableProps;
  total: number;
  paid: number;
  due: number;
}

interface TableSelectionProps<T> {
  isCustomer: boolean;
  data: Transfer[];
}

export default function UserReportTable<T>({
  data,
  isCustomer,
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);

  const [search, setSearch] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((field) =>
          String(field)
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim())
        )
      )
    );
  };

  const rows = filteredData.map((item, index) => {
    return (
      <>
        <tr key={index}>
          <td style={{ whiteSpace: 'nowrap' }}>{item.name}</td>
          {/* <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}> */}
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.subTable.purchase}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.subTable.purchaseReturn}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.subTable.sales}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.subTable.salesReturn}
          </td>
          {/* </td> */}
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.total}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.paid}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.due}
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />

      {/* <ScrollArea
        style={{
          height: '100%',
        }}
      > */}
      {/* <Container> */}
      <Center>
        <Table
          w={'90%'}
          //  sx={{ minWidth: '100%' }}
          verticalSpacing='sm'
          //  striped
          //  withBorder
          //  withColumnBorders
        >
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Name
              </th>
              <th
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                colSpan={4}
              >
                {isCustomer ? 'Sales' : 'Purchase'}
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Total
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Paid
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Due</th>
            </tr>
            <tr>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Purchase
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Purchase Return
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sales
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sales Return
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Center>
      {/* </Container> */}
      {/* </ScrollArea> */}
    </>
  );
}
