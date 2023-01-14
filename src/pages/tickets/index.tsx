import FormInput from "@/components/FormikCompo/FormikInput";
import FormikSelect from "@/components/FormikCompo/FormikSelect";
import TicketSelect from "@/components/TicketStatus";
import type { RouterOutputs } from "@/utils/trpc";
import { trpc } from "@/utils/trpc";
import type { ModalProps } from "@mantine/core";
import { Button, Container, Group, Modal, Table, Title } from "@mantine/core";
import { Form, Formik } from "formik";
import React from "react";

const AddnewTicket = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs["workflowRouter"]["getWorkflow"];
}) => {
  return (
    <Modal title="Add Ticket" {...modalProps}>
      <Formik
        initialValues={{ name: "", initialstatus: "" }}
        onSubmit={(values, action) => {
          console.log(values);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form>
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter Name"
              withAsterisk
            />
            <FormikSelect
              mt={"xs"}
              name="initialstatus"
              label="Initial Status"
              placeholder="Select Status"
              data={data.map((val) => ({ value: val.id, label: val.name }))}
            />
            <Button type="submit" mt={"md"}>
              submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);

  const mokdata = [
    {
      id: 1,
      name: "Todo1",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 2,
      name: "Todo2",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 3,
      name: "Todo3",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
    {
      id: 4,
      name: "Todo4",
      done: false,
      created: "2021-08-01",
      status: "open",
    },
  ];

  const workflow = trpc.workflowRouter.getWorkflow.useQuery();
  console.log(workflow.data);
  const selectData = workflow.data?.map((item) => ({
    label: item.name,
    name: item.name,
  }));

  const MultiSelectData = [
    {
      label: "Open",
      value: "open",
    },
    {
      label: "Closed",
      value: "closed",
    },
    {
      label: "In Progress",
      value: "in progress",
    },
    {
      label: "On Hold",
      value: "on hold",
    },
  ];
  return (
    <>
      <AddnewTicket
        modalProps={{ opened: modal, onClose: () => setModal(false) }}
        data={workflow.data}
      />
      <Container w={"100%"} p={"md"}>
        <Group w={"100%"} style={{ justifyContent: "space-between" }}>
          <Title size={30} fw={500}>
            Tickets
          </Title>
          <Button onClick={() => setModal(true)}>Add</Button>
        </Group>
        <Table mt={"5vh"}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Todo</th>
              <th>Done</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mokdata.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.done ? "Yes" : "No"}</td>
                <td>{item.created}</td>
                <td>
                  <Formik
                    initialValues={{ ticketStatus: "" }}
                    onSubmit={(values, action) => {
                      console.log(values);
                    }}
                  >
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                      <Form>
                        <Group w={"100%"} p={0} m={0}>
                          <TicketSelect
                            data={
                              workflow.data?.map((val) => ({
                                value: val.id,
                                label: val.name,
                              })) || []
                            }
                            name="ticketStatus"
                          />
                          <Button type="submit">ok</Button>
                        </Group>
                      </Form>
                    )}
                  </Formik>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Index;
