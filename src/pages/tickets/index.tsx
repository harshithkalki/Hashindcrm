import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import TicketSelect from '@/components/TicketStatus';
import type { RootState } from '@/store';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { ModalProps } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { Select } from '@mantine/core';
import { Button, Container, Group, Modal, Table, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

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
        {({ isSubmitting }) => (
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
  const initialStatuses = trpc.workflowRouter.getInitialStatuses.useQuery();
  const tickets = trpc.ticketRouter.getAllTicket.useQuery();
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();
  const user = useSelector((state: RootState) => state.clientState.client);
  const [activeTicket, setActiveTicket] = React.useState<string | null>(null);
  const assignableUsers = trpc.ticketRouter.getAssignableUsers.useQuery({
    ticketId: activeTicket || '',
  });
  const assignTicket = trpc.ticketRouter.assignTicket.useMutation();

  if (!user) return null;

  return (
    <Layout>
      <AddnewTicket
        modalProps={{ opened: modal, onClose: () => setModal(false) }}
        data={initialStatuses.data}
      />
      <Container
        w={'100%'}
        p={'md'}
        h='100%'
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <Group w={'100%'} style={{ justifyContent: 'space-between' }}>
          <Title size={30} fw={500}>
            Tickets
          </Title>
          <Button onClick={() => setModal(true)}>Add</Button>
        </Group>
        <ScrollArea style={{ flex: '1', marginTop: '5vh' }}>
          <div>
            <Table mb='10vh'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Todo</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th></th>
                  <th>Assigned</th>
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
                    <td>
                      <Select
                        placeholder='Select User'
                        data={
                          item.assignedTo
                            ? assignableUsers.data?.map((val) => ({
                                value: val._id.toString(),
                                label: val.firstName.concat(
                                  ' ',
                                  val.middleName,
                                  ' ',
                                  val.lastName
                                ),
                                group: val.role.name,
                              })) || [
                                {
                                  value: item.assignedTo._id,
                                  label: item.assignedTo.firstName.concat(
                                    ' ',
                                    item.assignedTo.middlename,
                                    ' ',
                                    item.assignedTo.lastName
                                  ),
                                  group: item.assignedTo.role.name,
                                },
                              ]
                            : [
                                {
                                  value: user._id,
                                  label: user.firstName.concat(
                                    ' ',
                                    user.middleName,
                                    ' ',
                                    user.lastName
                                  ),
                                  group: user.role.name,
                                },
                              ]
                        }
                        disabled={
                          item.assignedTo
                            ? item.assignedTo._id !== user?._id
                            : false
                        }
                        onChange={async (val) => {
                          if (!val) return;
                          await assignTicket.mutateAsync({
                            ticketId: item._id.toString(),
                            userId: val,
                          });
                        }}
                        onFocus={() => setActiveTicket(item._id.toString())}
                        onBlur={() => setActiveTicket(null)}
                        value={item.assignedTo?._id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ScrollArea>
      </Container>
    </Layout>
  );
};

export default Index;
