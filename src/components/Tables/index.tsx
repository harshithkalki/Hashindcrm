import { useState } from "react";
import type { GroupProps } from "@mantine/core";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import { keys } from "@mantine/utils";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          theme.fn.rgba(theme.colors[theme.primaryColor]![7], 0.2)
        : theme.colors[theme.primaryColor]?.[0],
  },
}));

type Data<T> = T & {
  id: string;
};
interface TableSelectionProps<T> {
  data: Data<T>[];
  isDeleteColumn?: boolean;
  isEditColumn?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
  keysandlabels: KeysAndLabels<T>;
}

type KeysAndLabels<T> = {
  [K in keyof T]: string;
};

export default function TableSelection<T>({
  data,
  isDeleteColumn,
  isEditColumn,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
  keysandlabels,
}: TableSelectionProps<T>) {
  const { classes, cx } = useStyles();
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");
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
      setSelection(data.map((item) => item.id));
    }
  };

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
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        {keys(keysandlabels).map((key) => (
          <td
            key={`${item[key]}`}
            style={{
              whiteSpace: "nowrap",
              textAlign: "center",
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
                  onEdit && onEdit(item.id);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>
            )}
            {isDeleteColumn && (
              <ActionIcon
                color="red"
                onClick={() => {
                  onDelete && onDelete(item.id);
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
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea
        style={{
          height: "100%",
        }}
      >
        <Table sx={{ minWidth: "100%" }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === data.length}
                  indeterminate={
                    selection.length > 0 && selection.length !== data.length
                  }
                  transitionDuration={0}
                />
              </th>
              {keys(keysandlabels)?.map((item) => (
                <th
                  key={item.toString()}
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                >
                  {keysandlabels[item]}
                </th>
              ))}
              {(isDeleteColumn || isEditColumn) && <th />}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
