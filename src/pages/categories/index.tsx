import CategoriesTable from "@/components/Tables/CategoriesTable";
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
import FormikSelect from "@/components/FormikCompo/FormikSelect";

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};
interface Category {
  name: string;
  slug: string;
  logo: string;
  children?: Category[];
}

const Data: Category[] = [
  {
    name: "Category 1",
    slug: "category-1",
    logo: "https://picsum.photos/200",
    children: [
      {
        name: "Category 1.1",
        slug: "category-1.1",
        logo: "https://picsum.photos/200",
        children: [
          {
            name: "Category 1.1.1",
            slug: "category-1.1.1",
            logo: "https://picsum.photos/200",
          },
          {
            name: "Category 1.1.2",
            slug: "category-1.1.2",
            logo: "https://picsum.photos/200",
          },
        ],
      },
      {
        name: "Category 1.2",
        slug: "category-1.2",
        logo: "https://picsum.photos/200",
      },
    ],
  },
  {
    name: "Category 2",
    slug: "category-2",
    logo: "https://picsum.photos/200",
  },
  {
    name: "Category 3",
    slug: "category-3",
    logo: "https://picsum.photos/200",
  },
  {
    name: "Category 4",
    slug: "category-4",
    logo: "https://picsum.photos/200",
  },
  {
    name: "Category 5",
    slug: "category-5",
    logo: "https://picsum.photos/200",
  },
  {
    name: "Category 6",
    slug: "category-6",
    logo: "https://picsum.photos/200",
  },
];

const Index = () => {
  const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const AddBrand = () => {
    return (
      <>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title="Add Categories"
        >
          <Formik
            initialValues={{ name: "", slug: "", logo: "", parentCatory: "" }}
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
                <FormikSelect
                  name="parentCatory"
                  label="Parent Category"
                  data={[
                    { label: "Parent Category 1", value: "Parent Category 1" },
                    { label: "Parent Category 2", value: "Parent Category 2" },
                    { label: "Parent Category 3", value: "Parent Category 3" },
                    { label: "Parent Category 4", value: "Parent Category 4" },
                  ]}
                  placeholder="Enter Parent Category"
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
          <Title fw={400}>Categories</Title>
          <Button size="xs" onClick={() => setModal(true)}>
            Add Categories
          </Button>
        </Group>
        <Divider mt={"xl"} />
        <CategoriesTable data={Data} />
      </Container>
    </>
  );
};

export default Index;
