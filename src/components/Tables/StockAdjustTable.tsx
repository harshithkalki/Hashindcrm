import { useState } from "react";
import type { GroupProps } from "@mantine/core";
import { Button, Modal } from "@mantine/core";
import { Image } from "@mantine/core";
import { Container } from "@mantine/core";
import { Table, ScrollArea, TextInput, ActionIcon, Group } from "@mantine/core";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import { Formik, Form } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "../FormikCompo/FormikInput";
import FormikSelect from "../FormikCompo/FormikSelect";
import Formiktextarea from "../FormikCompo/FormikTextarea";

interface Stock {
  id: string;
  name: string;
  logo: string;
  quantity: string;
}
interface TableSelectionProps<T> {
  data: Stock[];
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

export default function StockadjustmentTable<T>({
  data,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);
  const [modal, setModal] = useState(false);
  const [sData, setSData] = useState<StockEdit>({
    id: "",
    name: "",
    currentStock: 0,
    quantity: 0,
    adjustment: "",
    note: "",
  });

  const [search, setSearch] = useState("");

  const AdjustForm = ({ data }: AdjustForm) => {
    return (
      <>
        <Modal
          onClose={() => setModal(false)}
          opened={modal && sData !== undefined}
          title={"Add Adjustment"}
        >
          <Formik
            initialValues={
              data || {
                name: "",
                currentStock: 0,
                quantity: 0,
                adjustment: "",
                note: "",
              }
            }
            onSubmit={(values) => {
              console.log(values);
            }}
            validationSchema={toFormikValidationSchema(
              z.object({
                name: z.string(),
                quantity: z.number(),
                adjustment: z.string(),
                note: z.string().optional(),
              })
            )}
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormikSelect
                  mt={"md"}
                  name="name"
                  label="Product Name"
                  searchable
                  creatable
                  data={[
                    { label: "Product 1", value: "Product 1" },
                    { label: "Product 2", value: "Product 2" },
                    { label: "Product 3", value: "Product 3" },
                  ]}
                  placeholder="Select Product"
                  withAsterisk
                />
                <Group mt={"md"}>
                  <TextInput
                    name="currentStock"
                    value={values.currentStock}
                    label="Current Stock"
                    disabled
                  />
                  <FormInput
                    name="quantity"
                    label="Quantity"
                    placeholder="Quantity"
                    type="number"
                    withAsterisk
                  />
                </Group>
                <FormikSelect
                  name="adjustment"
                  label="Adjustment"
                  mt={"md"}
                  data={[
                    { label: "Add", value: "add" },
                    { label: "Remove", value: "remove" },
                  ]}
                  placeholder="Select Adjustment"
                  withAsterisk
                />
                <Formiktextarea
                  name="note"
                  label="Note"
                  placeholder="Note"
                  mt={"md"}
                />
                <Button type="submit" mt={"lg"}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal>
      </>
    );
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
    return (
      <>
        <tr key={item.id}>
          <td style={{ whiteSpace: "nowrap" }}>{item.id}</td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            <Group spacing="xs">
              <Image
                src={item.logo}
                alt={item.name}
                radius="lg"
                style={{ width: 32, height: 32 }}
              />
              {item.name}
            </Group>
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.quantity}
          </td>
          <td>
            <Group
              spacing={0}
              {...groupProps}
              style={{ justifyContent: "center" }}
            >
              <ActionIcon
                onClick={() => {
                  setSData({
                    id: "item.id",
                    name: item.name,
                    currentStock: item.quantity as unknown as number,
                    quantity: 0,
                    adjustment: "",
                    note: "",
                  });
                  setModal(true);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                color="red"
                onClick={() => {
                  onDelete && onDelete(item.id);
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
      <AdjustForm data={sData} />
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
        <Container>
          <Table sx={{ minWidth: "100%" }} verticalSpacing="sm">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>#</th>
                <th style={{ whiteSpace: "nowrap" }}>Name</th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Quantity
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
