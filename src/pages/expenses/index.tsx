import React, { useEffect, useState } from 'react';
import TableSelection from '@/components/Tables';
import {
  Button,
  Center,
  Container,
  createStyles,
  FileInput,
  Group,
  Loader,
  Modal,
  Pagination,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import FormDate from '@/components/FormikCompo/FormikDate';
import { IconUpload } from '@tabler/icons';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import { ZExpenseCreateInput } from '@/zobjs/expense';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { trpc } from '@/utils/trpc';
import { z } from 'zod';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'dark',
    padding: '15px 20px',
    borderRadius: '5px',
    boxShadow: theme.shadows.xs,
  },
  profile: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: theme.shadows.sm,
    },
  },
  addressWrapper: {
    padding: '8px 13px',
  },
  containerStyles: {
    margin: 'auto',
    width: '100%',
  },
}));

type CreateExpense = z.infer<typeof ZExpenseCreateInput>;

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (inputs: CreateExpense) => Promise<void>;
  onClose: () => void;
}

const ExpenseCategorySelect = () => {
  const [search, setSearch] = useState('');
  const categorys = trpc.expenseCategoryRouter.expenseCategories.useQuery(
    { search: search },
    { refetchOnWindowFocus: false }
  );
  return (
    <FormikSelect
      label='Expense Category'
      data={
        categorys.data?.docs?.map((category) => ({
          label: category.name,
          value: category._id.toString(),
        })) || []
      }
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      placeholder='Pick one'
      name='category'
      withAsterisk
    />
  );
};

const AddExpense = ({ modal, setModal, onSubmit, onClose }: modalProps) => {
  const { classes, cx } = useStyles();
  // const AddExpense = trpc.expenseRouter.create.useMutation();
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add Expense'
        size={'50%'}
      >
        <Formik
          initialValues={{
            category: '',
            amount: 0,
            date: '',
            notes: '',
          }}
          validationSchema={toFormikValidationSchema(ZExpenseCreateInput)}
          onSubmit={async (values) => {
            await onSubmit(values);
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <SimpleGrid
                cols={2}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: 'md', cols: 2, spacing: 'sm' },
                  { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                  { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                ]}
              >
                <ExpenseCategorySelect />

                <FormDate
                  name='date'
                  label='Date'
                  placeholder='Select Date'
                  withAsterisk
                />
                <FormInput
                  name='amount'
                  label='Amount'
                  placeholder='Enter Amount'
                  withAsterisk
                  type={'number'}
                />
              </SimpleGrid>
              <Formiktextarea
                name='notes'
                label='Notes'
                placeholder='Enter Notes'
                mb={'xl'}
              />
              <Group position='center'>
                <Button type='submit' size='xs'>
                  Submit
                </Button>
                <Button
                  bg={'gray'}
                  size='xs'
                  onClick={() => {
                    setModal(false);
                  }}
                >
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

const EditExpense = ({
  _id,
  onClose,
}: {
  _id: string;
  onClose: () => void;
}) => {
  const { classes, cx } = useStyles();
  const updateExpense = trpc.expenseRouter.update.useMutation();
  const Expense = trpc.expenseRouter.get.useQuery({ _id: _id });

  return (
    <Modal opened={Boolean(_id)} onClose={() => onClose()} title='Edit Expense'>
      {Expense.isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Formik
          initialValues={{
            category: Expense.data?.category,
            amount: Expense.data?.amount,
            date: Expense.data?.date,
            notes: Expense.data?.notes,
          }}
          validationSchema={toFormikValidationSchema(ZExpenseCreateInput)}
          onSubmit={async (values) => {
            await updateExpense.mutateAsync({
              _id,
              ...values,
              category: values.category?.toString(),
            });
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <SimpleGrid
                cols={2}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: 'md', cols: 2, spacing: 'sm' },
                  { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                  { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                ]}
              >
                <ExpenseCategorySelect />

                <FormDate
                  name='date'
                  label='Date'
                  placeholder='Select Date'
                  withAsterisk
                />
                <FormInput
                  name='amount'
                  label='Amount'
                  placeholder='Enter Amount'
                  withAsterisk
                  type={'number'}
                />
              </SimpleGrid>
              <Formiktextarea
                name='notes'
                label='Notes'
                placeholder='Enter Notes'
                mb={'xl'}
              />
              <Group position='center'>
                <Button type='submit' size='xs'>
                  Submit
                </Button>
                <Button
                  bg={'gray'}
                  size='xs'
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </Group>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const CreateExpense = trpc.expenseRouter.create.useMutation();
  const Expenses = trpc.expenseRouter.expenses.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: () => page, refetchOnWindowFocus: false }
  );
  const deleteExpense = trpc.expenseRouter.delete.useMutation();
  const [editId, setEditId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!Expenses.data?.pages.find((pageData) => pageData.page === page)) {
      Expenses.fetchNextPage();
    }
  }, [Expenses, page]);

  // console.log(Data);

  if (Expenses.isLoading) {
    return (
      <Center h='100%'>
        <Loader />
      </Center>
    );
  }

  return (
    <Layout>
      <AddExpense
        modal={modal}
        setModal={setModal}
        onSubmit={async (inputs) => {
          return CreateExpense.mutateAsync(inputs).then((res) => {
            // console.log(res);
          });
        }}
        onClose={() => {
          setModal(false);
          Expenses.refetch();
        }}
      />

      {Boolean(editId) && (
        <EditExpense
          _id={editId}
          onClose={() => {
            setEditId('');
            Expenses.refetch();
          }}
        />
      )}
      <Container>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Expenses</Title>
          <Button
            size='xs'
            mr={'md'}
            onClick={() => {
              setModal(true);
            }}
          >
            Add Expense
          </Button>
        </Group>
        {Expenses.isLoading ? (
          <Loader />
        ) : (
          <>
            <TableSelection
              data={
                Expenses.data?.pages
                  .find((pageData) => pageData.page === page)
                  ?.docs.map((val) => ({
                    ...val,
                    _id: val._id.toString(),
                    category: (val.category as unknown as { name: string })
                      .name,
                    date: dayjs(val.date).format('DD MMMM YYYY'),
                  })) || []
              }
              colProps={{
                // category: 'Expense Category',
                // amount: 'Amount',
                // date: 'Date',
                // notes: 'Notes',
                category: {
                  label: 'Expense Category',
                },
                amount: {
                  label: 'Amount',
                },
                date: {
                  label: 'Date',
                },
                notes: {
                  label: 'Notes',
                },
              }}
              deletable={true}
              editable={true}
              onDelete={(id) => {
                deleteExpense.mutateAsync({ _id: id }).then(() => {
                  router.reload();
                });
              }}
              onEdit={(id) => setEditId(id)}
            />
            <Center>
              {(Expenses.data?.pages.find((pageData) => pageData.page === page)
                ?.totalPages ?? 0) > 1 && (
                <Pagination
                  total={
                    Expenses.data?.pages.find(
                      (pageData) => pageData.page === page
                    )?.totalPages ?? 0
                  }
                  initialPage={1}
                  page={page}
                  onChange={setPage}
                />
              )}
            </Center>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Index;
