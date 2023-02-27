import { useState } from 'react';
import type { GroupProps } from '@mantine/core';

import { Image } from '@mantine/core';

import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';

import type { ProductFormType } from '../ProductForm';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  logo?: string;
  warehouse: string;
  category: string;
  brand: string;
  salePrice: number;
  purchasePrice: number;
  quantity: number;
  mrp: number;
  tax: number;
  quantityAlert: number;
  description?: string;
}

interface TableSelectionProps<T> {
  data: Product[];
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

export default function ProductTable<T>({
  data,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);
  const router = useRouter();
  const [search, setSearch] = useState('');
  // const [modal, setModal] = useState(false);

  // const getProduct = trpc.productRouter.getProduct.useQuery({
  //   id: productId,
  // });
  const deleteProduct = trpc.productRouter.delete.useMutation();

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
              style={{ width: 32, height: 32 }}
            />
            {item.name}
          </Group>
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.warehouse}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.brand}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.category}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.mrp}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.purchasePrice}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.salePrice}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.tax}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.quantity}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.quantityAlert}
        </td>
        <td>
          <Group spacing={0} {...groupProps}>
            <ActionIcon
              onClick={() => {
                router.push(`/products/edit/${item.id}`);
              }}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>

            <ActionIcon
              color='red'
              onClick={() => {
                deleteProduct.mutateAsync({ id: item.id }).then(() => {
                  router.reload();
                });
                // router.reload();
              }}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
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
      <ScrollArea style={{ height: '100%' }}>
        {/* <Container> */}
        <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Name
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Warehouse
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Brand
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Category
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>MRP</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Purchase Price
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Sale Price
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Tax</th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Quantity
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Quantity Alert
              </th>
              <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {/* </Container> */}
      </ScrollArea>
      {/* </div> */}
    </>
  );
}
