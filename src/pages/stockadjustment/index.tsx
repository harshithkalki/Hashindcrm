import FormInput from "@/components/FormikCompo/FormikInput";
import FormikSelect from "@/components/FormikCompo/FormikSelect";
import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
import StockadjustmentTable from "@/components/Tables/StockAdjustTable";
import {
  Button,
  Container,
  Group,
  Modal,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, Formik } from "formik";
import React from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const data = [
  {
    id: "1",
    name: "Product 1",
    logo: "https://picsum.photos/200",
    quantity: "10",
  },
  {
    id: "2",
    name: "Product 2",
    logo: "https://picsum.photos/200",
    quantity: "20",
  },
  {
    id: "3",
    name: "Product 3",
    logo: "https://picsum.photos/200",
    quantity: "30",
  },
];

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const AdjustForm = () => {
    return (
      <>
        <Modal
          onClose={() => setModal(false)}
          opened={modal}
          title={"Add Adjustment"}
        >
          <Formik
            initialValues={{
              name: "",
              quantity: 0,
              adjustment: "",
              note: "",
            }}
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
            {({ handleSubmit }) => (
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
                  <TextInput value={0} label="Current Stock" disabled />
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

  return (
    <>
      <AdjustForm />
      <Container>
        <Group mb={"lg"} mt={"lg"} style={{ justifyContent: "space-between" }}>
          <Title fw={400}>Stock Adjustment</Title>
          <Button
            size="xs"
            onClick={() => {
              setModal(true);
            }}
          >
            Add Categories
          </Button>
        </Group>
        <StockadjustmentTable data={data} />
      </Container>
    </>
  );
};

export default Index;
