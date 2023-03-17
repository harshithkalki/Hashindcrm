import { useMemo, useState } from 'react';
import type { GroupProps } from '@mantine/core';
import { Container } from '@mantine/core';
import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';
import { useRouter } from 'next/router';
import type { ZRole } from '@/zobjs/role';
import type { z } from 'zod';

interface TableSelectionProps<T> {
  data: T[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

export default function RolesTable<T>({
  data,
  onDelete,
  editDeleteColumnProps: { groupProps } = {},
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState('');
  const router = useRouter();
  console.log(data);

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

  useMemo(() => {
    setFilteredData(data);
  }, [data]);

  const rows = filteredData.map((item, index) => {
    return (
      <tr key={item._id}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {index + 1}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.name}
        </td>
        <td>
          <Group spacing={0} {...groupProps}>
            <ActionIcon
              onClick={() => {
                router.push('/roles/edit/' + item._id);
              }}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>

            <ActionIcon
              color='red'
              onClick={() => {
                onDelete && onDelete(item._id);
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

      <ScrollArea
        style={{
          height: '100%',
        }}
      >
        <Container>
          <Table verticalSpacing='sm'>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  S.NO
                </th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Name
                </th>
                <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </ScrollArea>
    </>
  );
}
