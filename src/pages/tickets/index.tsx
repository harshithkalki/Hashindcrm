import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import TicketSelect from '@/components/TicketStatus';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { ModalProps } from '@mantine/core';
import { Button, Container, Group, Modal, Table, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import React from 'react';

const AddnewTicket = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getInitialStatuses'];
}) => {
  const createTicket = trpc.ticketRouter.createTicket.useMutation();

  return (
    <Modal title='Add Ticket' {...modalProps}>
      <Formik
        initialValues={{ name: '', initialstatus: '' }}
        onSubmit={(values, { setSubmitting }) => {
          createTicket
            .mutateAsync({
              status: values.initialstatus,
              name: values.name,
            })
            .then(() => setSubmitting(false));
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form>
            <FormInput
              name='name'
              label='Name'
              placeholder='Enter Name'
              withAsterisk
            />
            <FormikSelect
              mt={'xs'}
              name='initialstatus'
              label='Initial Status'
              placeholder='Select Status'
              data={data.map((val) => ({
                value: val._id.toString(),
                label: val.name,
              }))}
            />
            <Button type='submit' mt={'md'} loading={isSubmitting}>
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
      name: 'Todo1',
      done: false,
      created: '2021-08-01',
      status: 'open',
    },
    {
      id: 2,
      name: 'Todo2',
      done: false,
      created: '2021-08-01',
      status: 'open',
    },
    {
      id: 3,
      name: 'Todo3',
      done: false,
      created: '2021-08-01',
      status: 'open',
    },
    {
      id: 4,
      name: 'Todo4',
      done: false,
      created: '2021-08-01',
      status: 'open',
    },
  ];

  const initialStatuses = trpc.workflowRouter.getInitialStatuses.useQuery();
  const tickets = trpc.ticketRouter.getAllTicket.useQuery();
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();

  return (
    <>
      <AddnewTicket
        modalProps={{ opened: modal, onClose: () => setModal(false) }}
        data={initialStatuses.data}
      />
      <Container w={'100%'} p={'md'}>
        <Group w={'100%'} style={{ justifyContent: 'space-between' }}>
          <Title size={30} fw={500}>
            Tickets
          </Title>
          <Button onClick={() => setModal(true)}>Add</Button>
        </Group>
        <Table mt={'5vh'}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Todo</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets.data?.map((item) => (
              <tr key={item._id.toString()}>
                <td>{item._id.toString()}</td>
                <td>{item.name}</td>
                <td>{item.createdAt.toString()}</td>
                <td>
                  <Formik
                    initialValues={{
                      ticketStatus: item.status as unknown as string,
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      updateTicket
                        .mutateAsync({
                          nextStatusId: values.ticketStatus,
                          ticketId: item._id.toString(),
                        })
                        .then(() => setSubmitting(false));
                    }}
                  >
                    {({ isSubmitting }) => {
                      const { data } =
                        trpc.workflowRouter.getLinkedStatuses.useQuery(
                          item.status as unknown as string
                        );

                      return (
                        <Form>
                          <Group w={'100%'} p={0} m={0}>
                            <TicketSelect
                              data={
                                data?.map((val) => ({
                                  value: val._id,
                                  label: val.name,
                                })) || []
                              }
                              name='ticketStatus'
                            />
                            <Button type='submit' loading={isSubmitting}>
                              ok
                            </Button>
                          </Group>
                        </Form>
                      );
                    }}
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
