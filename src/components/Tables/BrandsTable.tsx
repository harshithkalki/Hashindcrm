import { useMemo, useState } from 'react';
import { Center, GroupProps } from '@mantine/core';
import { Button, FileInput, Modal } from '@mantine/core';
import { Image } from '@mantine/core';
import { Container } from '@mantine/core';
import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash, IconUpload } from '@tabler/icons';
import { ZBrandCreateInput } from '@/zobjs/brand';
import axios from 'axios';
import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '../FormikCompo/FormikInput';
import { trpc } from '@/utils/trpc';

interface Product {
  id: string;
  slug: string;
  companyID: string;
  name: string;
  logo: string;
}
interface TableSelectionProps<T> {
  data: Product[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export default function BrandsTableSelection<T>({
  data,
  onDelete,
  onEdit,
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
  useMemo(() => {
    setFilteredData(data);
  }, [data]);

  const rows = filteredData.map((item) => {
    return (
      <tr key={item.id}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Center>
            <Image
              src={item.logo}
              alt={'brand'}
              radius='lg'
              style={{ width: 32, height: 32 }}
              withPlaceholder
            />
          </Center>
          {/* {item.name} */}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.name}
        </td>

        <td>
          <Center>
            <Group spacing={0} {...groupProps}>
              <ActionIcon
                onClick={() => {
                  onEdit && onEdit(item.id);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                color='red'
                onClick={() => {
                  onDelete && onDelete(item.id);
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Center>
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
          <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Logo
                </th>

                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Name
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
