import { Group, Title, Image, TextInput, Table, Center } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { useState } from 'react';

const data = [
  {
    id: '1',
    name: 'Product 1',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    category: 'Category 1',
    brand: 'Brand 1',
    purchasePrice: 100,
    salesPrice: 200,
  },
  {
    id: '2',
    name: 'Product 2',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    category: 'Category 1',
    brand: 'Brand 1',
    purchasePrice: 100,
    salesPrice: 200,
  },
  {
    id: '3',
    name: 'Product 3',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    category: 'Category 1',
    brand: 'Brand 1',
    purchasePrice: 100,
    salesPrice: 200,
  },
  {
    id: '4',
    name: 'Product 4',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    category: 'Category 1',
    brand: 'Brand 1',
    purchasePrice: 100,
    salesPrice: 200,
  },
  {
    id: '5',
    name: 'Product 5',
    logo: 'https://picsum.photos/seed/picsum/200/300',
    itemCode: '123456',
    category: 'Category 1',
    brand: 'Brand 1',
    purchasePrice: 100,
    salesPrice: 200,
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
          {item.category}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.brand}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.purchasePrice}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.salesPrice}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Group mb={'xl'}>
        <Title fw={400}>Rate List</Title>
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
                Category
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Brand
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>MRP</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sale Price
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Center>
    </>
  );
};

export default Index;
