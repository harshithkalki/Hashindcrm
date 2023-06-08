import React, { useEffect, useState } from 'react';
import TableSelection from '@/components/Tables';
import {
  Button,
  Center,
  Container,
  createStyles,
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
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import { ZExpenseCreateInput } from '@/zobjs/expense';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { trpc } from '@/utils/trpc';
import type { z } from 'zod';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { LoadingScreen } from '@/components/LoadingScreen';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  const { t } = useTranslation('common');
  return (
    <FormikSelect
      label={`${t('expense category')}`}
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
  const { t } = useTranslation('common');
  const utils = trpc.useContext();
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
            showNotification({
              title: 'New Expense',
              message: 'Created successfully',
            });
            utils.expenseRouter.expenses.invalidate();
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
                  label={`${t('date')}`}
                  placeholder='Select Date'
                  withAsterisk
                />
                <FormInput
                  name='amount'
                  label={`${t('amount')}`}
                  placeholder='Enter Amount'
                  withAsterisk
                  type={'number'}
                />
              </SimpleGrid>
              <Formiktextarea
                name='notes'
                label={`${t('notes')}`}
                placeholder='Enter Notes'
                mb={'xl'}
              />
              <Group position='center'>
                <Button type='submit' size='xs'>
                  {t('submit')}
                </Button>
                <Button
                  bg={'gray'}
                  size='xs'
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  {t('cancel')}
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
  const { t } = useTranslation('common');
  const utils = trpc.useContext();

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
            showNotification({
              title: 'Edit Expense',
              message: 'Edited successfully',
            });
            onClose();
            utils.expenseRouter.expenses.invalidate();
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
                  label={`${t('Date')}`}
                  placeholder='Select Date'
                  withAsterisk
                />
                <FormInput
                  name='amount'
                  label={`${t('Amount')}`}
                  placeholder='Enter Amount'
                  withAsterisk
                  type={'number'}
                />
              </SimpleGrid>
              <Formiktextarea
                name='notes'
                label={`${t('Notes')}`}
                placeholder='Enter Notes'
                mb={'xl'}
              />
              <Group position='center'>
                <Button type='submit' size='xs'>
                  {t('Submit')}
                </Button>
                <Button
                  bg={'gray'}
                  size='xs'
                  onClick={() => {
                    onClose();
                  }}
                >
                  {t('Cancel')}
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
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!Expenses.data?.pages.find((pageData) => pageData.page === page)) {
      Expenses.fetchNextPage();
    }
  }, [Expenses, page]);

  // console.log(Data);

  if (Expenses.isLoading) {
    return <LoadingScreen />;
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
      <Container
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Group my='lg' style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>{t('expenses')}</Title>
          <Button
            size='xs'
            mr={'md'}
            onClick={() => {
              setModal(true);
            }}
          >
            {t('add expense')}
          </Button>
        </Group>

        <TableSelection
          data={
            Expenses.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
                category: (val.category as unknown as { name: string }).name,
                date: dayjs(val.date).format('DD MMMM YYYY'),
              })) || []
          }
          colProps={{
            category: {
              label: `${t('expense category')}`,
            },
            amount: {
              label: `${t('amount')}`,
            },
            date: {
              label: `${t('date')}`,
            },
            notes: {
              label: `${t('notes')}`,
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
                Expenses.data?.pages.find((pageData) => pageData.page === page)
                  ?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
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
