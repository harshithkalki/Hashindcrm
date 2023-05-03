import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import TicketSelect from '@/components/TicketStatus';
import type { RootState } from '@/store';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { ModalProps } from '@mantine/core';
import { Select } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import { ScrollArea } from '@mantine/core';
import { Button, Container, Group, Modal, Table, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import DropzoneComp from '@/components/DropZone';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import type { ITicketCreateInput } from '@/zobjs/ticket';
import _ from 'lodash';
import SelectUserItem from '@/components/SelectUserItem';
import dayjs from 'dayjs';

const initialValues: ITicketCreateInput = {
  name: '',
  assignedTo: undefined,
  description: undefined,
  files: [],
  issueType: '',
  status: '',
};

const AddnewTicket = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getInitialStatuses'];
}) => {
  const createTicket = trpc.ticketRouter.createTicket.useMutation();

  return (
    <Modal title='Add Ticket' {...modalProps} size={'xl'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          createTicket
            .mutateAsync({
              ...values,
            })
            .then(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <SimpleGrid
              m={'md'}
              cols={3}
              breakpoints={[
                { maxWidth: 'md', cols: 3, spacing: 'md' },
                { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                { maxWidth: 'xs', cols: 1, spacing: 'sm' },
              ]}
              style={{ alignItems: 'end' }}
            >
              <FormikSelect
                name='issueType'
                label='Issue Type'
                placeholder='Select Issue Type'
                data={[
                  { value: 'bug', label: 'Bug' },
                  { value: 'feature', label: 'Feature' },
                ]}
              />
              <FormInput
                name='name'
                label='Name'
                placeholder='Enter Name'
                withAsterisk
              />
              <FormikSelect
                mt={'xs'}
                name='status'
                label='Initial Status'
                placeholder='Select Status'
                data={data.map((val) => ({
                  value: val._id.toString(),
                  label: val.name,
                }))}
              />
            </SimpleGrid>
            <Formiktextarea
              name='description'
              label='Description'
              placeholder='Enter Description'
              withAsterisk
              mb={'md'}
            />
            <DropzoneComp />
            <Button type='submit' mt={'md'} loading={isSubmitting}>
              submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const StatusSelect = ({
  ticketId,
  statusId,
  assignedTo,
}: {
  ticketId: string;
  statusId: string;
  assignedTo?: string;
}) => {
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();
  const { data } = trpc.workflowRouter.getLinkedStatuses.useQuery(statusId);
  const deboune = useCallback(
    _.debounce((fn) => fn(), 1000),
    []
  );
  const user = useSelector((state: RootState) => state.clientState.client);

  return (
    <Formik
      initialValues={{
        ticketStatus: statusId,
      }}
      onSubmit={(values, { setSubmitting }) => {
        updateTicket
          .mutateAsync({
            nextStatusId: values.ticketStatus,
            ticketId,
          })
          .then(() => setSubmitting(false));
      }}
    >
      {({ submitForm }) => {
        return (
          <Form>
            <Group w={'100%'} p={0} m={0}>
              <TicketSelect
                data={
                  data?.map((val) => ({
                    value: val._id,
                    label: val.name,
                  })) ?? []
                }
                name='ticketStatus'
                variant='unstyled'
                placeholder='Select Status'
                onChange={() => {
                  deboune(submitForm);
                }}
                disabled={assignedTo !== user?._id}
              />
            </Group>
          </Form>
        );
      }}
    </Formik>
  );
};

const AssignableSelect = ({
  ticketId,
  assigned,
}: {
  ticketId: string;
  assigned: string;
}) => {
  const { data } = trpc.ticketRouter.getAssignableUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const assignTicket = trpc.ticketRouter.assignTicket.useMutation();
  const deboune = useCallback(
    _.debounce((fn) => fn(), 1000),
    []
  );
  const user = useSelector((state: RootState) => state.clientState.client);

  const userOptions = useMemo(() => {
    return data?.map((val) => ({
      value: val._id.toString(),
      label: val.name,
      role: val.role.name,
    }));
  }, [data]);

  return (
    <Formik
      initialValues={{
        assignTo: assigned,
      }}
      onSubmit={(values, { setSubmitting }) => {
        assignTicket
          .mutateAsync({
            ticketId,
            userId: values.assignTo,
          })
          .then(() => setSubmitting(false));
      }}
    >
      {({ submitForm, setFieldValue, values }) => {
        return (
          <Form>
            <Group w={'100%'} p={0} m={0}>
              <Select
                itemComponent={SelectUserItem}
                data={userOptions ?? []}
                name='reportTo'
                variant='unstyled'
                placeholder='Select Assignee'
                onChange={(val) => {
                  setFieldValue('assignTo', val);
                  deboune(submitForm);
                }}
                value={values.assignTo}
                disabled={assigned !== user?._id}
              />
            </Group>
          </Form>
        );
      }}
    </Formik>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const initialStatuses = trpc.workflowRouter.getInitialStatuses.useQuery();
  const tickets = trpc.ticketRouter.getAllTicket.useQuery();
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();
  const user = useSelector((state: RootState) => state.clientState.client);
  const [activeTicket, setActiveTicket] = React.useState<string | null>(null);
  // const assignableUsers = trpc.ticketRouter.getAssignableUsers.useQuery({
  //   ticketId: activeTicket || '',
  // });
  // const assignTicket = trpc.ticketRouter.assignTicket.useMutation();

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
                  <th>Assigned</th>
                </tr>
              </thead>
              <tbody>
                {tickets.data?.map((item) => (
                  <tr key={item._id.toString()}>
                    <td>{item._id.toString()}</td>
                    <td>{item.name}</td>
                    <td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</td>
                    <td>
                      <StatusSelect
                        statusId={item.status.toString()}
                        ticketId={item._id.toString()}
                        assignedTo={item.assignedTo?.toString()}
                      />
                    </td>
                    <td>
                      <AssignableSelect
                        assigned={item.assignedTo?.toString() ?? ''}
                        ticketId={item._id.toString()}
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

// export default function Index() {
//   return <div>hello</div>;
// }
