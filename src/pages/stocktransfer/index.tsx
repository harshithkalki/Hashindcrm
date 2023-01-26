import StockTransferTable from "@/components/Tables/StockTransferTable";
import { Button, Container, Divider, Group, Modal, Title } from "@mantine/core";
import React from "react";

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const AddStockTransfer = () => {
    return (
      <Modal
        opened={modal}
        onClose={() => {
          setModal(false);
        }}
        title="Add Stock Transfer"
        size="lg"
      ></Modal>
    );
  };
  return (
    <>
      <Container>
        <Group style={{ justifyContent: "space-between" }} mt={"md"}>
          <Title fw={400}>Stock Transfer</Title>
          <Button
            size="xs"
            onClick={() => {
              setModal(true);
            }}
          >
            Add Transfer
          </Button>
        </Group>
        <Divider mt={"lg"} />
        <StockTransferTable
          data={[
            {
              invoicenum: "INV-0001",
              warehouse: "Warehouse 1",
              date: "2021-01-01",
              status: "Pending",
              paidamount: "100",
              totalamount: "100",
              paymentstatus: "Pending",
            },
            {
              invoicenum: "INV-0002",
              warehouse: "Warehouse 2",
              date: "2021-01-01",
              status: "Pending",
              paidamount: "100",
              totalamount: "100",
              paymentstatus: "Pending",
            },
            {
              invoicenum: "INV-0003",
              warehouse: "Warehouse 3",
              date: "2021-01-01",
              status: "Pending",
              paidamount: "100",
              totalamount: "100",
              paymentstatus: "Pending",
            },
          ]}
        />
      </Container>
    </>
  );
};

export default Index;
