import { useState } from 'react';
import { Image } from '@mantine/core';
import { Table, ScrollArea, TextInput, Group } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

interface Product {
  date: string;
  invoicenumber: string;
  paymentstatus: string;
  user: string;
  userprofile: string;
  createdby: string;
  amount: number;
}
interface TableSelectionProps<T> {
  data: Product[];
}

export default function SalesSummaryTable<T>({ data }: TableSelectionProps<T>) {
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
      <tr key={index}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.date}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.invoicenumber}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Group spacing='xs'>
            <Image
              src={item.userprofile}
              alt={item.user}
              radius='lg'
              style={{ width: 28, height: 28 }}
            />
            {item.user}
          </Group>
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.amount}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.paymentstatus}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.createdby}
        </td>
      </tr>
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

      <ScrollArea
        style={{
          height: '100%',
        }}
      >
        {/* <Container w={'100%'} p={0}> */}
        <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Payment Date
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Reference Number
              </th>
              <th style={{ whiteSpace: 'nowrap' }}>User</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Amount
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Payment Status
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Created By
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {/* </Container> */}
      </ScrollArea>
    </>
  );
}
