import { useEffect, useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  TextInput,
  Group,
  ActionIcon,
  Image,
} from '@mantine/core';
import {
  IconMinus,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons';
import { trpc } from '@/utils/trpc';
import { useTranslation } from 'react-i18next';

interface Category {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  children?: Category[];
}

interface TableSortProps {
  data: Category[];
  onEdit: (id: string) => void;
}

export function TableSort({ data, onEdit }: TableSortProps) {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const deleteCategory = trpc.categoryRouter.delete.useMutation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setFilteredData(
      data.filter((item) =>
        Object.keys(item).some((key) =>
          String(key).toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  function RowMap({ data: parent, index }: { data: Category; index: number }) {
    const children = trpc.categoryRouter.getChildCategories.useQuery({
      _id: parent._id,
    });
    const childrenRows = children.data
      ? rowdatamap(
          children.data.map((val) => ({ ...val, _id: val._id.toString() }))
        )
      : null;
    const [hide, setHide] = useState(true);

    return (
      <>
        <tr>
          <td>{index + 1}</td>
          <td>
            {children && (children.data?.length ?? 0) > 0 && (
              <ActionIcon onClick={() => setHide(!hide)}>
                {hide ? (
                  <IconPlus size={16} stroke={1.5} />
                ) : (
                  <IconMinus size={16} stroke={1.5} />
                )}
              </ActionIcon>
            )}
          </td>

          <td>
            <Image
              src={parent.logo}
              alt={'brand'}
              radius='lg'
              style={{ width: 32, height: 32 }}
              withPlaceholder
            />
          </td>
          <td>{parent.name}</td>
          <td>
            <Group spacing={0}>
              <ActionIcon onClick={() => onEdit(parent._id)}>
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                color='red'
                onClick={() => deleteCategory.mutateAsync({ id: parent._id })}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </td>
        </tr>
        {children && (children.data?.length ?? 0) > 0 && !hide && childrenRows}
      </>
    );
  }

  function rowdatamap(data: Category[]): JSX.Element[] {
    const rows = data.map((row, index) => {
      return <RowMap index={index} data={row} key={index} />;
    });

    return rows;
  }
  const { t } = useTranslation('common');

  const rows = rowdatamap(filteredData);
  return (
    <ScrollArea>
      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing='md'
        verticalSpacing='xs'
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
      >
        <thead>
          <tr>
            <th>{t('sno')}</th>
            <th>{t('logo')}</th>
            <th>{t('name')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td>
                <Text weight={500} align='center'>
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

export default TableSort;
