import { useState } from 'react';
import type { GroupProps } from '@mantine/core';
import {
  Table,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
  Container,
} from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';

interface Transfer {
  name: string;
  email: string;
  created: string;
  balance: string;
  status: string;
}
interface TableSelectionProps<T> {
  data: Transfer[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

interface StockEdit {
  id: string;
  name: string;
  currentStock: number;
  quantity: number;
  adjustment: string;
  note: string;
}
interface AdjustForm {
  data: StockEdit;
}

export default function PartiesTable<T>({
  data,
  onDelete,
  editDeleteColumnProps: { groupProps } = {},
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
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.email}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.created}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.balance}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.status}
          </td>

          <td>
            <Group
              spacing={0}
              {...groupProps}
              style={{ justifyContent: 'center' }}
            >
              <ActionIcon
                onClick={() => {
                  console.log(index);
                  //   setModal(true);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                color='red'
                onClick={() => {
                  console.log(index);
                  // onDelete && onDelete(item.invoicenum);
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
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

      <ScrollArea
        style={{
          height: '100%',
        }}
      >
        <Container>
          <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Name
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Email
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Created At
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Balance
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </ScrollArea>
    </>
  );
}
