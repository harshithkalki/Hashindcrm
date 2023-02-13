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

interface TableProps {
  invoicenum: string;
  name: string;
  date: string;
  status: string;
  paidamount: string;
  totalamount: string;
  paymentstatus: string;
}
interface TableSelectionProps<T> {
  data: TableProps[];
  isCustomer?: boolean;
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

export default function SalesTable<T>({
  data,
  isCustomer,
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
          <td style={{ whiteSpace: 'nowrap' }}>{item.invoicenum}</td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.date}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.name}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.status}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.paidamount}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.totalamount}
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.paymentstatus}
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
                  invoice
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  date
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {isCustomer ? 'Customer' : 'Supplier'}
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Paid Amount
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Total Amount
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Payment Status
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
