import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';
import TicketSelect from '@/components/TicketStatus';
import type { RootState } from '@/store';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';
import type { ModalProps } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Badge } from '@mantine/core';
import { Avatar, LoadingOverlay, Text } from '@mantine/core';
import { Center, Divider, Pagination } from '@mantine/core';
import { Select } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import { Button, Container, Group, Modal, Title } from '@mantine/core';
import { FieldArray, Form, Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DropzoneComp from '@/components/DropZone';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import { ZTicketCreateInput } from '@/zobjs/ticket';
import type { ITicket, ITicketCreateInput } from '@/zobjs/ticket';
import _ from 'lodash';
import SelectUserItem from '@/components/SelectUserItem';
import dayjs from 'dayjs';
import TableSelection from '@/components/Tables';
import { IconDownload, IconFileInvoice, IconTrash } from '@tabler/icons';
import type { FileWithPath } from '@mantine/dropzone';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { Accordion } from '@mantine/core';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useTranslation } from 'react-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { showNotification } from '@mantine/notifications';

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
  const utils = trpc.useContext();
  const { t } = useTranslation('common');

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

            utils.ticketRouter.openTickets.invalidate();
            showNotification({
              message: 'Ticket Created',
              color: 'teal',
            });

            modalProps.onClose();
            setSubmitting(false);
          };

          submit();
        }}
        validationSchema={toFormikValidationSchema(ZTicketCreateInput)}
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
                label={`${t('issue type')}`}
                placeholder='Select Issue Type'
                data={[
                  { value: 'bug', label: 'Bug' },
                  { value: 'sub-task', label: 'Sub-Task' },
                  { value: 'epic', label: 'Epic' },
                  { value: 'improvement', label: 'Improvement' },
                  { value: 'newFeature', label: 'New Feature' },
                  { value: 'story', label: 'Story' },
                  { value: 'task', label: 'Task' },
                ]}
              />
              <FormInput
                name='name'
                label={`${t('Short description')}`}
                placeholder='Enter Short Description'
                withAsterisk
              />
              <FormikSelect
                mt={'xs'}
                name='status'
                label={`${t('Status')}`}
                placeholder='Status'
                data={data.map((val) => ({
                  value: val._id.toString(),
                  label: val.name,
                }))}
              />
            </SimpleGrid>
            <Formiktextarea
              name='description'
              label={`${t('Long Description')}`}
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
              {t('submit')}
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
  const utils = trpc.useContext();

  return (
    <Formik
      initialValues={{
        ticketStatus: statusId,
      }}
      onSubmit={(values, { setSubmitting }) => {
        updateTicket
          .mutateAsync({
            _id: ticketId,
            status: values.ticketStatus,
          })
          .then(async () => {
            setSubmitting(false);
            await utils.ticketRouter.myTickets.invalidate();
            await utils.ticketRouter.otherTickets.invalidate();
            await utils.ticketRouter.openTickets.invalidate();
          });
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
  const utils = trpc.useContext();

  const userOptions = useMemo(() => {
    const options = data?.map((val) => {
      return {
        value: val._id.toString(),
        label: val.name,
        role: val.role.name,
      };
    });

    if (!user) return options;

    if (user.role !== 'super-admin') {
      options?.push({
        value: user._id,
        label: 'Me',
        role: user.role.name,
      });
    }

    return options;
  }, [data, user]);

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
          .then(async () => {
            setSubmitting(false);
            await utils.ticketRouter.myTickets.invalidate();
            await utils.ticketRouter.otherTickets.invalidate();
            await utils.ticketRouter.openTickets.invalidate();
          });
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
  data: TicketCustom | null;
  onClose: () => void;
}) => {
  const utils = trpc.useContext();
  const updateTicket = trpc.ticketRouter.updateTicket.useMutation();
  const { data: staff, isLoading } = trpc.staffRouter.getStaff.useQuery(
    { _id: (data?.assignedTo as unknown as string) ?? '' },
    {
      enabled: !!data?.assignedTo,
      refetchOnWindowFocus: false,
    }
  );
  const { classes } = useStyles();
  const { mutateAsync: delteFiles } =
    trpc.filesRouter.deleteFiles.useMutation();

  if (isLoading && data?.assignedTo) return <LoadingOverlay visible />;

  if (!data) return null;

  return (
    <Modal title='Ticket Details' opened={!!data} onClose={onClose} size='xl'>
      <Formik
        initialValues={{
          description: data.description,
          files: data.files,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const filesToDelete = data.files.filter(
            (file) => !values.files.includes(file)
          );

          if (filesToDelete.length) {
            await delteFiles({ keys: filesToDelete.map((file) => file.name) });
          }

          updateTicket
            .mutateAsync({
              _id: data._id.toString(),
              description: values.description,
              files: values.files,
            })
            .then(() => {
              setSubmitting(false);
              utils.ticketRouter.tickets.invalidate();
              onClose();
            });
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <Text fw={'bold'}>Status</Text>
                    <Badge>
                      {(data.status as unknown as { name: string }).name}
                    </Badge>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <Text fw={'bold'}>Issue Type</Text>
                    {data.issueType?.length > 0 && (
                      <Badge>{data.issueType}</Badge>
                    )}
                  </div>
                  <Formiktextarea
                    label='Description'
                    placeholder='Description...'
                    name='description'
                  />
                </div>
              </div>
              <div>
                <Text fw={'bold'}>Files</Text>
                <FieldArray
                  name='files'
                  render={(arrayHelpers) => (
                    <div>
                      {values?.files?.map((file, index) => (
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

                            <ActionIcon
                              variant='filled'
                              color='red'
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
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
                  )}
                />
              </div>
              <Group position='center'>
                <Button
                  variant='outline'
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' loading={isSubmitting}>
                  Save
                </Button>
              </Group>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const AssignedToMe = ({ setTicketId }: { setTicketId: SetTicket }) => {
  const [page, setPage] = useState(1);
  const tickets = trpc.ticketRouter.myTickets.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  const deleteTicket = trpc.ticketRouter.deleteTicket.useMutation();
  useEffect(() => {
    if (!tickets.data?.pages.find((pageData) => pageData.page === page)) {
      tickets.fetchNextPage();
    }
  }, [tickets, page]);
  const { t } = useTranslation('common');

  return (
    <div
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        height: 'calc(100vh - 10rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            label: `${t('ticket')}`,
          },
          name: {
            label: `${t('todo')}`,
          },
          createdAt: {
            label: `${t('created at')}`,
            Component: ({ data: { createdAt } }) => (
              <>{dayjs(createdAt).format('DD/MM/YYYY')}</>
            ),
          },
          status: {
            label: `${t('status')}`,
            Component: ({ data: { status, _id, assignedTo } }) => (
              <StatusSelect
                statusId={status._id.toString() as string}
                ticketId={_id.toString()}
                assignedTo={assignedTo?.toString()}
              />
            ),
          },
          assignedTo: {
            label: `${t('assigned')}`,
            Component: ({ data: { assignedTo, _id } }) => (
              <AssignableSelect
                ticketId={_id.toString()}
                assigned={assignedTo?.toString() ?? ''}
              />
            ),
          },
          showMore: {
            label: '',
            Component: ({ data }) => (
              <Button
                variant='subtle'
                size='xs'
                onClick={() => {
                  setTicketId({
                    ...data,
                    assignedTo: data.assignedTo?.toString(),
                    status: data.status as unknown as {
                      _id: string;
                      name: string;
                    },
                    companyId: data.companyId?.toString(),
                  });
                }}
              >
                Show More
              </Button>
            ),
          },
        }}
        onDelete={async (id) => {
          await deleteTicket.mutateAsync({
            ticketId: id,
          });
          tickets.refetch();
        }}
        deletable
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
    </div>
  );
};

const OpenTickets = ({ setTicketId }: { setTicketId: SetTicket }) => {
  const [page, setPage] = useState(1);
  const tickets = trpc.ticketRouter.openTickets.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  const deleteTicket = trpc.ticketRouter.deleteTicket.useMutation();
  useEffect(() => {
    if (!tickets.data?.pages.find((pageData) => pageData.page === page)) {
      tickets.fetchNextPage();
    }
  }, [tickets, page]);
  const { t } = useTranslation('common');

  return (
    <div
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        height: 'calc(100vh - 10rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            label: `${t('ticket')}`,
          },
          name: {
            label: `${t('todo')}`,
          },
          createdAt: {
            label: `${t('created at')}`,
            Component: ({ data: { createdAt } }) => (
              <>{dayjs(createdAt).format('DD/MM/YYYY')}</>
            ),
          },
          status: {
            label: `${t('status')}`,
            Component: ({ data: { status, _id, assignedTo } }) => (
              <StatusSelect
                statusId={status._id.toString() as string}
                ticketId={_id.toString()}
                assignedTo={assignedTo?.toString()}
              />
            ),
          },
          assignedTo: {
            label: `${t('assigned')}`,
            Component: ({ data: { assignedTo, _id } }) => (
              <AssignableSelect
                ticketId={_id.toString()}
                assigned={assignedTo?.toString() ?? ''}
              />
            ),
          },
          showMore: {
            label: '',
            Component: ({ data }) => (
              <Button
                variant='subtle'
                size='xs'
                onClick={() => {
                  setTicketId({
                    ...data,
                    assignedTo: data.assignedTo?.toString(),
                    status: data.status as unknown as {
                      _id: string;
                      name: string;
                    },
                    companyId: data.companyId?.toString(),
                  });
                }}
              >
                Show More
              </Button>
            ),
          },
        }}
        onDelete={async (id) => {
          await deleteTicket.mutateAsync({
            ticketId: id,
          });
          tickets.refetch();
        }}
        deletable
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
    </div>
  );
};

type SetTicket = (ticket: TicketCustom) => void;

type TicketCustom = Omit<ITicket, 'status'> & {
  status: {
    _id: string;
    name: string;
  };
  _id: string;
};

const OtherTickets = ({ setTicketId }: { setTicketId: SetTicket }) => {
  const [page, setPage] = useState(1);
  const tickets = trpc.ticketRouter.otherTickets.useInfiniteQuery(
    {
      limit: 10,
    },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (!tickets.data?.pages.find((pageData) => pageData.page === page)) {
      tickets.fetchNextPage();
    }
  }, [tickets, page]);
  const { t } = useTranslation('common');

  return (
    <div
      style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        height: 'calc(100vh - 10rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            label: `${t('ticket')}`,
          },
          name: {
            label: `${t('todo')}`,
          },
          createdAt: {
            label: `${t('created at')}`,
            Component: ({ data: { createdAt } }) => (
              <>{dayjs(createdAt).format('DD/MM/YYYY')}</>
            ),
          },
          status: {
            label: `${t('status')}`,
            Component: ({ data: { status, _id, assignedTo } }) => (
              <StatusSelect
                statusId={status._id.toString() as string}
                ticketId={_id.toString()}
                assignedTo={assignedTo?.toString()}
              />
            ),
          },
          assignedTo: {
            label: `${t('assigned')}`,
            Component: ({ data: { assignedTo, _id } }) => (
              <AssignableSelect
                ticketId={_id.toString()}
                assigned={assignedTo?.toString() ?? ''}
              />
            ),
          },
          showMore: {
            label: '',
            Component: ({ data }) => (
              <Button
                variant='subtle'
                size='xs'
                onClick={() => {
                  setTicketId({
                    ...data,
                    assignedTo: data.assignedTo?.toString(),
                    status: data.status as unknown as {
                      _id: string;
                      name: string;
                    },
                    companyId: data.companyId?.toString(),
                  });
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
    </div>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const initialStatuses = trpc.workflowRouter.getInitialStatuses.useQuery();
  const user = useSelector((state: RootState) => state.clientState.client);
  const [ticket, setTicket] = React.useState<TicketCustom | null>(null);
  const theme = useMantineTheme();

  const { t } = useTranslation('common');
  if (!user) return null;

  return (
    <Layout>
      <AddnewTicket
        modalProps={{ opened: modal, onClose: () => setModal(false) }}
        data={initialStatuses.data}
      />
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
      >
        <Group
          style={{
            justifyContent: 'space-between',
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.lg,
          }}
        >
          <Title fw={400}>{`${t('tickets')}`}</Title>
          <Button onClick={() => setModal(true)}>{`${t('add ticket')}`}</Button>
        </Group>
        <Divider mt={'xl'} />
        <div
          style={{
            flex: '1',
            overflow: 'auto',
          }}
        >
          <Accordion chevronPosition='left' defaultValue='assignedToMe'>
            <Accordion.Item value='assignedToMe'>
              <Accordion.Control>Assigned to me</Accordion.Control>
              <Accordion.Panel>
                <AssignedToMe setTicketId={setTicket} />
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='open'>
              <Accordion.Control>Open</Accordion.Control>
              <Accordion.Panel>
                <OpenTickets setTicketId={setTicket} />
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='other'>
              <Accordion.Control>Other</Accordion.Control>
              <Accordion.Panel>
                <OtherTickets setTicketId={setTicket} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
      <TicketDetails data={ticket} onClose={() => setTicket(null)} />
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
