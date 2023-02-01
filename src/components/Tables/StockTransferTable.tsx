import { useState } from "react";
import type { GroupProps } from "@mantine/core";
import {
  Table,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
  Button,
  Modal,
  Container,
} from "@mantine/core";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons";
import { Formik, Form } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "../FormikCompo/FormikInput";
import FormikSelect from "../FormikCompo/FormikSelect";
import Formiktextarea from "../FormikCompo/FormikTextarea";

interface Transfer {
  invoicenum: string;
  warehouse: string;
  date: string;
  status: string;
  paidamount: string;
  totalamount: string;
  paymentstatus: string;
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

export default function StockTransferTable<T>({
  data,
  onDelete,
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
          title={"Edit Adjustment"}
        ></Modal>
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
        <tr key={item.invoicenum}>
          <td style={{ whiteSpace: "nowrap" }}>{item.invoicenum}</td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.warehouse}
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.date}
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.status}
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.paidamount}
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.totalamount}
          </td>
          <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
            {item.paymentstatus}
          </td>
          <td>
            <Group
              spacing={0}
              {...groupProps}
              style={{ justifyContent: "center" }}
            >
              <ActionIcon
                onClick={() => {
                  console.log(item.invoicenum);
                  //   setModal(true);
                }}
              >
                <IconPencil size={16} stroke={1.5} />
              </ActionIcon>

              <ActionIcon
                color="red"
                onClick={() => {
                  onDelete && onDelete(item.invoicenum);
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
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  invoicenum
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Warehouse
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Stock Transfer Date
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Transfer Status
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Amount Paid
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Total Amount
                </th>
                <th style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                  Payment Status
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
