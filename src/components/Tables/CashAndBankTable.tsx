import { useState } from 'react';
import type { GroupProps } from '@mantine/core';
import { Image } from '@mantine/core';
import { Container } from '@mantine/core';
import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';

interface Product {
  paymentdate: string;
  referencenumber: string;
  paymenttype: string;
  user: string;
  userprofile: string;
  modetype: string;
  amount: number;
}
interface TableSelectionProps<T> {
  data: Product[];
}

export default function CashandBankTable<T>({ data }: TableSelectionProps<T>) {
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
          {item.paymentdate}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.referencenumber}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.paymenttype}
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
          {item.modetype}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.amount}
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
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Payment Type
              </th>
              <th style={{ whiteSpace: 'nowrap' }}>User</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Mode Type
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Amount
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
