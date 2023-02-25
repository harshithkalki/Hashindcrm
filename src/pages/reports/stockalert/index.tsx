import Layout from '@/components/Layout';
import {
  ActionIcon,
  Group,
  Title,
  Image,
  TextInput,
  Table,
  Center,
} from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';
import React, { useState } from 'react';

const data = [
  {
    id: '1',
    name: 'Product 1',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    currentStock: 100,
    quantityAlert: 50,
  },
  {
    id: '2',
    name: 'Phone',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    currentStock: 100,
    quantityAlert: 50,
  },
  {
    id: '3',
    name: 'oven',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    currentStock: 100,
    quantityAlert: 50,
  },
  {
    id: '4',
    name: 'lighter',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    currentStock: 100,
    quantityAlert: 50,
  },
];

const Index = () => {
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

  const rows = filteredData.map((item) => {
    return (
      <tr key={item.id}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Group spacing='xs'>
            <Image
              src={item.logo}
              alt={item.name}
              radius='lg'
              style={{ width: 25, height: 25 }}
            />
            {item.name}
          </Group>
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.itemCode}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.currentStock}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.quantityAlert}
        </td>
      </tr>
    );
  });

  return (
    <Layout>
      <Group mb={'xl'}>
        <Title fw={400}>Stock Alert</Title>
      </Group>

      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Center>
        <Table w={'90%'} verticalSpacing='sm'>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Item Code
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Current Stock
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Quantity Alert
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Center>
    </Layout>
  );
};

export default Index;
