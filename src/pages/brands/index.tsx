import TableSelection from "@/components/Tables";
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  Title,
} from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";
import FormInput from "@/components/FormikCompo/FormikInput";
import { Formik, Form } from "formik";
import { IconUpload } from "@tabler/icons";

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const Data = [
  {
    id: "1",
    name: "Brand 1",
    logo: "https://picsum.photos/200",
  },
  {
    id: "2",
    name: "Brand 2",
    logo: "https://picsum.photos/200",
  },
  {
    id: "3",
    name: "Brand 3",
    logo: "https://picsum.photos/200",
  },
  {
    id: "4",
    name: "Brand 4",
    logo: "https://picsum.photos/200",
  },
  {
    id: "5",
    name: "Brand 5",
    logo: "https://picsum.photos/200",
  },
  {
    id: "6",
    name: "Brand 6",
    logo: "https://picsum.photos/200",
  },
  {
    id: "7",
    name: "Brand 7",
    logo: "https://picsum.photos/200",
  },
];

const Index = () => {
  const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const AddBrand = () => {
    return (
      <>
        <Modal opened={modal} onClose={() => setModal(false)} title="Add Brand">
          <Formik
            initialValues={{ name: "", slug: "", logo: "" }}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Enter Name"
                  withAsterisk
                  mt={"md"}
                />
                <FormInput
                  name="slug"
                  label="Slug"
                  placeholder="Enter Slug"
                  withAsterisk
                  mt={"xs"}
                />
                <FileInput
                  label="Logo"
                  name="logo"
                  mt={"md"}
                  placeholder="Select Logo"
                  icon={<IconUpload size={14} />}
                />
                <Group style={{ justifyContent: "end" }} mt={"md"} mb={"xs"}>
                  <Button
                    type="submit"
                    mt={"md"}
                    loading={isSubmitting}
                    size={"sm"}
                  >
                    Submit
                  </Button>
                  <Button mt={"md"} onClick={() => setModal(false)} size={"sm"}>
                    Cancel
                  </Button>
                </Group>
              </Form>
            )}
          </Formik>
        </Modal>
      </>
    );
  };
  return (
    <>
      <AddBrand />
      <Container mt={"xs"}>
        <Group style={{ justifyContent: "space-between" }}>
          <Title fw={400}>Brands</Title>
          <Button size="xs" onClick={() => setModal(true)}>
            Add Brand
          </Button>
        </Group>
        <Divider mt={"xl"} />
        <TableSelection
          data={Data}
          isDeleteColumn={true}
          isEditColumn={true}
          onDelete={(id) => console.log(id)}
          onEdit={(id) => console.log(id)}
          keysandlabels={{
            // displayName: "Display Name",
            id: "ID",
            name: "Name",
            logo: "Logo",
          }}
        />
      </Container>
    </>
  );
};

export default Index;
