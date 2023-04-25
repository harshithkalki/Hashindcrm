import type { ModalProps } from '@mantine/core';
import { Badge } from '@mantine/core';
import {
  Button,
  Container,
  Group,
  Modal,
  MultiSelect,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { z } from 'zod';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSwitch from '@/components/FormikCompo/FormikSwitch';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import TableSelection from '@/components/Tables';

const LinkStatus = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getWorkflow'];
}) => {
  const createLink = trpc.workflowRouter.createLink.useMutation();

  return (
    <Modal {...modalProps} title='Link Status'>
      <Formik
        initialValues={{ target: '', linkedStatus: '' }}
        onSubmit={(values, { setSubmitting }) => {
          createLink
            .mutateAsync({
              linkedStatus: values.linkedStatus,
              target: values.target,
            })
            .then(() => {
              setSubmitting(false);
              modalProps.onClose();
            });
        }}
        validationSchema={toFormikValidationSchema(
          z.object({
            target: z.string(),
            linkedStatus: z.string(),
          })
        )}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FormikSelect
              name='target'
              data={data.map((val) => ({ value: val._id, label: val.name }))}
              searchable
              placeholder='Search Status'
              clearable
            />
            <FormikSelect
              name='linkedStatus'
              data={
                data
                  .filter((val) => val._id !== values.target)
                  .filter(
                    (val) =>
                      !val.linkedStatuses
                        .map((val) => val.value)
                        .includes(values.target)
                  )
                  .map((val) => ({
                    value: val._id,
                    label: val.name,
                  })) ?? []
              }
              placeholder='Search status to link'
              searchable
              mt='md'
              disabled={!values.target}
              clearable
            />
            <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
              save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const RemoveLink = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getWorkflow'];
}) => {
  const createLink = trpc.workflowRouter.removeLink.useMutation();

  return (
    <Modal {...modalProps} title='Remove Link'>
      <Formik
        initialValues={{ target: '', linkedStatus: '' }}
        onSubmit={(values, { setSubmitting }) => {
          createLink
            .mutateAsync({
              linkedStatus: values.linkedStatus,
              target: values.target,
            })
            .then(() => {
              setSubmitting(false);
              modalProps.onClose();
            });
        }}
        validationSchema={toFormikValidationSchema(
          z.object({
            target: z.string(),
            linkedStatus: z.string(),
          })
        )}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FormikSelect
              name='target'
              data={data.map((val) => ({ value: val._id, label: val.name }))}
              searchable
              placeholder='Search Status'
              clearable
            />
            <FormikSelect
              name='linkedStatus'
              data={
                data
                  .find((val) => val._id === values.target)
                  ?.linkedStatuses.map((val) => ({
                    value: val.value,
                    label: val.name,
                  })) ?? []
              }
              placeholder='Search status to remove'
              searchable
              mt='md'
              disabled={!values.target}
              nothingFound='No Linked Statuses'
              clearable
            />
            <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
              save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const AddStatus = ({
  modalProps,
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getWorkflow'];
}) => {
  const createStatus = trpc.workflowRouter.createStatus.useMutation();

  return (
    <Modal {...modalProps}>
      <Formik
        initialValues={{ name: '', initial: false }}
        onSubmit={(values, { setSubmitting }) => {
          createStatus
            .mutateAsync({
              initialStatus: values.initial,
              name: values.name,
            })
            .then((res) => {
              setSubmitting(false);
              console.log(res);
            });
        }}
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
              name='name'
              label='Name'
              placeholder='Enter Name'
              withAsterisk
            />
            <FormikSwitch
              name='initial'
              label='Initial State'
              mt={'sm'}
            ></FormikSwitch>
            <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
              save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const Index = () => {
  const workflow = trpc.workflowRouter.getWorkflow.useQuery();
  const [link, setLink] = useState(false);
  const [remove, setRemove] = useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <Layout>
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group my='lg' position='apart'>
          <Title fw={400}>WorkFlow</Title>
          <Group position='apart'>
            <Button size='xs' onClick={() => setOpen(true)}>
              Add status
            </Button>
            <Button size='xs' onClick={() => setLink(true)}>
              Link status
            </Button>
            <Button size='xs' onClick={() => setRemove(true)}>
              Remove Link
            </Button>
          </Group>
        </Group>
        <TableSelection
          data={workflow.data ?? []}
          colProps={{
            name: {
              label: 'Name',
            },
            initialStatus: {
              label: 'Initial Status',
              Component: ({ data }) => {
                return <Badge>{data.initialStatus ? 'Yes' : 'No'}</Badge>;
              },
            },
            linkedStatuses: {
              label: 'Linked',
              Component: ({ data }) => {
                return (
                  <form>
                    <MultiSelect
                      data={data.linkedStatuses?.map((val) => ({
                        value: val.value,
                        label: val.name,
                      }))}
                      defaultValue={data.linkedStatuses.map((val) => val.value)}
                      readOnly
                    ></MultiSelect>
                  </form>
                );
              },
            },
          }}
        />
        <AddStatus
          modalProps={{
            opened: open,
            onClose: () => {
              workflow.refetch();
              setOpen(false);
            },
          }}
        />
        <LinkStatus
          modalProps={{
            opened: link,
            onClose: () => {
              workflow.refetch();
              setLink(false);
            },
          }}
          data={workflow.data}
        />
        <RemoveLink
          modalProps={{
            opened: remove,
            onClose: () => {
              workflow.refetch();
              setRemove(false);
            },
          }}
          data={workflow.data}
        />
      </Container>
    </Layout>
  );
};

export default Index;
