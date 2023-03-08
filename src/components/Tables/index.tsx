import { useMemo, useState } from 'react';
import type { GroupProps } from '@mantine/core';
import { Button, Text } from '@mantine/core';
import { Modal } from '@mantine/core';
import { Container } from '@mantine/core';
import {
  createStyles,
  Table,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
} from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons';
import { keys } from '@mantine/utils';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          theme.fn.rgba(theme.colors[theme.primaryColor]![7], 0.2)
        : theme.colors[theme.primaryColor]?.[0],
  },
}));

type Data<T> = T & {
  _id: string;
};

interface TableSelectionProps<T> {
  data: Data<T>[];
  deletable?: boolean;
  editable?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
  keysandlabels: KeysAndLabels<T>;
}

type KeysAndLabels<T> = {
  [K in keyof T]?: string;
};

function ConfirmDelete({
  onClose,
  onConfirm,
  isOpen,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isOpen: boolean;
}) {
  return (
    <Modal onClose={onClose} opened={isOpen} title='Delete'>
      <Text size='lg' weight={500}>
        Are you sure you want to delete this item?
      </Text>
      <Group position='center' mt='md'>
        <Button onClick={onClose} variant='outline'>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant='outline' color='red'>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}

export default function TableSelection<T>({
  data,
  deletable: isDeleteColumn,
  editable: isEditColumn,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
  keysandlabels,
}: TableSelectionProps<T>) {
  console.log(data);
  const { classes, cx } = useStyles();
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<string[]>([]);
  const toggleRow = (id: string) => {
    if (selection.includes(id)) {
      setSelection(selection.filter((item) => item !== id));
    } else {
      setSelection([...selection, id]);
    }
  };
  const toggleAll = () => {
    if (selection.length === data.length) {
      setSelection([]);
    } else {
      setSelection(data.map((item) => item._id));
    }
  };
  const [deleteId, setDeleteId] = useState<string>('');

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
    const selected = selection.includes(item._id);

    return (
      <tr key={item._id} className={cx({ [classes.rowSelected]: selected })}>
        {keys(keysandlabels).map((key) => (
          <td
            key={`${item[key]}`}
            style={{
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {item[key] as string}
          </td>
        ))}
        <td>
          <Group spacing={0} {...groupProps}>
            {isEditColumn && (
              <ActionIcon
                onClick={() => {
                  onEdit && onEdit(item._id);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>
            )}
            {isDeleteColumn && (
              <ActionIcon
                color='red'
                onClick={() => {
                  setDeleteId(item._id);
                  setSelection([item._id]);
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            )}
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      {isDeleteColumn && (
        <ConfirmDelete
          isOpen={Boolean(deleteId)}
          onClose={() => setDeleteId('')}
          onConfirm={() => {
            const selected = selection[0];
            if (selected) {
              onDelete && onDelete(selected);
            }
            setDeleteId('');
          }}
        />
      )}
      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea>
        <Container>
          <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
            <thead>
              <tr>
                {keys(keysandlabels)?.map((item) => (
                  <th
                    key={item.toString()}
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  >
                    {keysandlabels[item]}
                  </th>
                ))}
                {(isDeleteColumn || isEditColumn) && <th />}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </ScrollArea>
    </>
  );
}
