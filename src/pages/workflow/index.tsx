
import { Button, Center, Container, Modal, Title } from "@mantine/core";
import React from "react";
import { IconDatabase } from "@tabler/icons";
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Modal,
  MultiSelect,
  Switch,
  Table,
  Title,
} from "@mantine/core";
import React from "react";
import { IconDatabase, IconPencil } from "@tabler/icons";
import { z } from "zod";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@/components/FormikCompo/FormikInput";
import FormikSwitch from "@/components/FormikCompo/FormikSwitch";

const onSubmit = async (values: any, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const NoWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Modal
        opened={open}
        title="Create New WorkFlow"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Formik
          initialValues={{ name: "" }}
          onSubmit={onSubmit}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
            })
          )}
        >
          {({ isSubmitting }) => (
            <Form>
              <Title fw={200}>New WorkFlow</Title>
              {/* <Title fw={200}>New WorkFlow</Title> */}
              <FormInput
                name="name"
                label="Name"
                placeholder="Enter Name"
                withAsterisk
              />
              <Button type="submit" mt={"md"} loading={isSubmitting}>
                save
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>

      <Container style={{ alignContent: "center", marginTop: "30vh" }}>
        <Center>
          <Title fw={500}>Create New WorkFlow</Title>
        </Center>
        <Center
          style={{ alignItems: "center", justifyContent: "space-around" }}
        >
          <Button
            size="sm"
            mt={"md"}
            leftIcon={<IconDatabase />}
            onClick={() => setOpen(true)}
          >
            Create New
          </Button>
        </Center>
      </Container>
    </>
  );
};


const index = () => {
  return (
    <div>
      <NoWorkflow />

const WorkFlowTable = () => {
  const [open, setOpen] = React.useState(false);

  const Ddata = [
    {
      name: "New",
      initial: true,
      linked: ["New", "InProgress", "Completed"],
    },
    {
      name: "In Progress",
      initial: false,
      linked: [
        "New",
        "InProgress",
        "Completed",
        "Cancelled",
        "On Hold",
        "Done",
        "Rejected",
        "Approved",
        "Pending",
      ],
    },
    {
      name: "Completed",
      initial: false,
      linked: ["New", "In Progress", "Completed"],
    },
  ];
  const data = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];
  const MultiSelectData = Ddata.map((item) => {
    return { value: item.name, label: item.name };
  });

  return (
    <>
      <Modal
        opened={open}
        title="New Status"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Formik
          initialValues={{ name: "", initial: false }}
          onSubmit={onSubmit}
          validationSchema={toFormikValidationSchema(
            z.object({
              name: z.string(),
              initial: z.boolean(),
            })
          )}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                name="name"
                label="Name"
                placeholder="Enter Name"
                withAsterisk
              />
              <FormikSwitch
                name="initial"
                label="Initial State"
                mt={"sm"}
              ></FormikSwitch>
              <Button type="submit" size="xs" mt={"md"} loading={isSubmitting}>
                save
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <Container w={"100%"} p={0}>
        <Group h={"15vh"}>
          <Button size="xs" onClick={() => setOpen(true)}>
            Add status
          </Button>
        </Group>
        <Divider mb={"md"}></Divider>
        <Title size={30} fw={400}>
          WorkFlow
        </Title>
        <Table width={"100%"}>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th style={{ textAlign: "center" }}>sno</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Initial State</th>
              <th style={{ textAlign: "center" }}>Linked</th>
              <th></th>
            </tr>
            {Ddata.map((data, index) => (
              <tr key={index} style={{ height: "10vh", textAlign: "center" }}>
                <td style={{ width: "8%" }}>{index + 1}</td>
                <td style={{ width: "18%" }}>{data.name}</td>
                <td style={{ width: "15%" }}>{data.initial ? "Yes" : "No"}</td>
                <td style={{ width: "55%" }}>
                  <form>
                    <MultiSelect
                      data={data.linked}
                      defaultValue={data.linked}
                      readOnly
                    ></MultiSelect>
                  </form>
                </td>
                <td style={{ width: "5%", alignContent: "center" }}>
                  <ActionIcon
                    onClick={() => {
                      console.log(`${data.name}`);
                    }}
                  >
                    <IconPencil size={16} stroke={1.5} />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </thead>
        </Table>
      </Container>
    </>
  );
};

const index = () => {
  return (
    <div>
      {/* <NoWorkflow /> */}
      <WorkFlowTable />
    </div>
  );
};

export default index;
