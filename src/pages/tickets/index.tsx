import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import TicketSelect from '@/components/TicketStatus';
import type { RootState } from '@/store';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { ModalProps } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Badge } from '@mantine/core';
import { Textarea } from '@mantine/core';
import { Avatar, LoadingOverlay, Text } from '@mantine/core';
import { Center, Divider, Pagination } from '@mantine/core';
import { Select } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import { Button, Container, Group, Modal, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DropzoneComp from '@/components/DropZone';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import type { ITicketCreateInput, ITicket } from '@/zobjs/ticket';
import _ from 'lodash';
import SelectUserItem from '@/components/SelectUserItem';
import dayjs from 'dayjs';
import TableSelection from '@/components/Tables';
import { IconDownload, IconFileInvoice, IconTrash } from '@tabler/icons';
import type { FileWithPath } from '@mantine/dropzone';
import axios from 'axios';
import fileDownload from 'js-file-download';

const uploadFiles = async (files: FileWithPath[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const res = await axios.post<
    FormData,
    { data: { message: string; files: { name: string; url: string }[] } }
  >('/api/upload-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

const downloadFile = async (url: string, name: string) => {
  const res = await axios.get('/api/download-file', {
    params: {
      key: name,
    },
    responseType: 'blob',
  });

  fileDownload(res.data, name);
};

const initialValues: ITicketCreateInput = {
  name: '',
  assignedTo: undefined,
  description: undefined,
  files: [],
  issueType: '',
  status: '',
};

const useStyles = createStyles((theme) => ({
  file: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem',
    justifyContent: 'space-between',
    border: `1px solid ${theme.colors.gray[7]}`,
    borderRadius: theme.radius.md,
    padding: '0.5rem 1rem',
  },
}));

const AddnewTicket = ({
  modalProps,
  data = [],
}: {
  modalProps: ModalProps;
  data?: RouterOutputs['workflowRouter']['getInitialStatuses'];
}) => {
  const createTicket = trpc.ticketRouter.createTicket.useMutation();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { classes } = useStyles();
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  return (
    <Modal title='Add Ticket' {...modalProps} size={'xl'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          const submit = async () => {
            const upload = async () => {
              setFileUploadLoading(true);
              const uploadedFiles = await uploadFiles(files);
              setFileUploadLoading(false);

              values.files = uploadedFiles.files;
            };

            await upload();

            await createTicket.mutateAsync({
              ...values,
            });

            setSubmitting(false);
          };

          submit();
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
            <DropzoneComp onDrop={setFiles} loading={fileUploadLoading} />
            {files.map((file, index) => (
              <div className={classes.file} key={index}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <IconFileInvoice size={25} />
                  <Text>{file.name}</Text>
                </div>
                <Group>
                  <ActionIcon
                    variant='filled'
                    color='red'
                    onClick={() => {
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </div>
            ))}
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
                disabled={assignedTo !== user?._id && !!assignedTo}
                style={{
                  width: '100%',
                }}
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
                disabled={assigned !== user?._id && !!assigned}
              />
            </Group>
          </Form>
        );
      }}
    </Formik>
  );
};

const TicketDetails = ({
  data,
  onClose,
}: {
  data?: RouterOutputs['ticketRouter']['tickets']['docs'][number];
  onClose: () => void;
}) => {
  const utils = trpc.useContext();
  const { data: staff, isLoading } = trpc.staffRouter.getStaff.useQuery(
    { _id: (data?.assignedTo as unknown as string) ?? '' },
    {
      enabled: !!data?.assignedTo,
      refetchOnWindowFocus: false,
    }
  );
  const { classes } = useStyles();

  if (isLoading && data?.assignedTo) return <LoadingOverlay visible />;

  if (!data) return null;

  return (
    <Modal title='Ticket Details' opened={!!data} onClose={onClose} size='xl'>
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <Avatar
              src={staff?.profile}
              size='xl'
              style={{
                borderRadius: '50%',
              }}
            />
            <Text>{staff?.name ?? 'Not Assigned'}</Text>
            <Text size='xs' fw={'bold'}>
              {staff?.role?.displayName}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Text fw={'bold'}>Status</Text>
              <Badge>{(data.status as unknown as { name: string }).name}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Text fw={'bold'}>Issue Type</Text>
              {data.issueType?.length > 0 && <Badge>{data.issueType}</Badge>}
            </div>
            <Textarea
              label='Description'
              placeholder='Description...'
              value={data?.description}
              readOnly
            />
          </div>
        </div>
        <div>
          <Text fw={'bold'}>Files</Text>
          <div>
            {data?.files?.map((file, index) => (
              <div className={classes.file} key={index}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <IconFileInvoice size={25} />
                  <Text>{file.name}</Text>
                </div>
                <Group>
                  <ActionIcon
                    variant='filled'
                    onClick={() => {
                      downloadFile(file.url, file.name);
                    }}
                  >
                    <IconDownload />
                  </ActionIcon>

                  <ActionIcon variant='filled' color='red'>
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </div>
            ))}
            {data.files.length === 0 && (
              <div className={classes.file}>
                <div style={{ flex: 1 }}>
                  <Text align='center'>No files attached</Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const initialStatuses = trpc.workflowRouter.getInitialStatuses.useQuery();
  const [page, setPage] = useState(1);
  const tickets = trpc.ticketRouter.tickets.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();
  const user = useSelector((state: RootState) => state.clientState.client);
  const [ticketId, setTicketId] = React.useState<string | null>(null);

  useEffect(() => {
    if (!tickets.data?.pages.find((pageData) => pageData.page === page)) {
      tickets.fetchNextPage();
    }
  }, [tickets, page]);

  if (!user) return null;

  return (
    <Layout>
      <AddnewTicket
        modalProps={{ opened: modal, onClose: () => setModal(false) }}
        data={initialStatuses.data}
      />
      <Container
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Tickets</Title>
          <Button onClick={() => setModal(true)}>Add</Button>
        </Group>
        <Divider mt={'xl'} />

        <TableSelection
          data={
            tickets.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
                showMore: '',
              })) ?? []
          }
          colProps={{
            _id: {
              label: 'Id',
            },
            name: {
              label: 'Todo',
            },
            createdAt: {
              label: 'Created',
              Component: ({ data: { createdAt } }) => (
                <>{dayjs(createdAt).format('DD/MM/YYYY')}</>
              ),
            },
            status: {
              label: 'Status',
              Component: ({ data: { status, _id, assignedTo } }) => (
                <StatusSelect
                  statusId={status._id.toString() as string}
                  ticketId={_id.toString()}
                  assignedTo={assignedTo?.toString()}
                />
              ),
            },
            assignedTo: {
              label: 'Assigned',
              Component: ({ data: { assignedTo, _id } }) => (
                <AssignableSelect
                  ticketId={_id.toString()}
                  assigned={assignedTo?.toString() ?? ''}
                />
              ),
            },
            showMore: {
              label: '',
              Component: ({ data: { _id } }) => (
                <Button
                  variant='subtle'
                  size='xs'
                  onClick={() => {
                    setTicketId(_id.toString());
                  }}
                >
                  Show More
                </Button>
              ),
            },
          }}
        />
        <Center>
          {(tickets.data?.pages.find((pageData) => pageData.page === page)
            ?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                tickets.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
      <TicketDetails
        data={
          tickets.data?.pages[page - 1]?.docs.find(
            (val) => val._id.toString() === ticketId
          ) ?? undefined
        }
        onClose={() => setTicketId(null)}
      />
    </Layout>
  );
};

export default Index;
