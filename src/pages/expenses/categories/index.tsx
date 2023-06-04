import React, { useEffect, useState } from 'react';
import TableSelection from '@/components/Tables';
import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Pagination,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import FormInput from '@/components/FormikCompo/FormikInput';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';
import type { z } from 'zod';
import { trpc } from '@/utils/trpc';
import type { ZExpenseCategoryCreateInput } from '@/zobjs/expenseCategory';
import { useRouter } from 'next/router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type CreateExpenseCategory = z.infer<typeof ZExpenseCategoryCreateInput>;

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (inputs: CreateExpenseCategory) => Promise<void>;
  onClose: () => void;
}

const AddExpense = ({ modal, setModal, onSubmit, onClose }: modalProps) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add Expense Category'
      >
        <Formik
          initialValues={{
            name: '',
            description: '',
          }}
          // onSubmit={(values) => {
          //   console.log(values);
          // }}
          onSubmit={async (values) => {
            await onSubmit(values);
            showNotification({
              title: 'New Expense Category',
              message: 'Created successfully',
            });
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <FormInput
                name='name'
                label={`${t('name')}`}
                placeholder='Enter Expense Category Name'
                withAsterisk
                mb={'sm'}
              />
              <Formiktextarea
                name='description'
                label={`${t('description')}`}
                placeholder='Enter Description'
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

const EditExpenseCategory = ({
  onClose,
  _id,
}: {
  _id: string;
  onClose: () => void;
}) => {
  const updateExpenseCategory = trpc.expenseCategoryRouter.update.useMutation();
  const expenseCategory = trpc.expenseCategoryRouter.get.useQuery({ _id: _id });
  const { t } = useTranslation('common');

  return (
    <Modal
      opened={Boolean(_id)}
      onClose={onClose}
      title='Edit Expense Category'
    >
      {expenseCategory.isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={{
            name: expenseCategory.data?.name,
            description: expenseCategory.data?.description,
          }}
          onSubmit={async (values) => {
            await updateExpenseCategory.mutateAsync({
              _id,
              ...values,
            });
            showNotification({
              title: 'New Expense Category',
              message: 'Edited successfully',
            });
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <FormInput
                name='name'
                label={`${t('name')}`}
                placeholder='Enter Expense Category Name'
                withAsterisk
                mb={'sm'}
              />
              <Formiktextarea
                name='description'
                label={`${t('description')}`}
                placeholder='Enter Description'
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
                    onClose();
                  }}
                >
                  {t('cancel')}
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
  const AddExpenseCategory = trpc.expenseCategoryRouter.create.useMutation();
  const expenseCategories =
    trpc.expenseCategoryRouter.expenseCategories.useInfiniteQuery(
      {
        limit: 10,
      },
      { getNextPageParam: () => page, refetchOnWindowFocus: false }
    );
  const deleteCategory = trpc.expenseCategoryRouter.delete.useMutation();

  const [editId, setEditId] = useState<string>('');
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (
      !expenseCategories.data?.pages.find((pageData) => pageData.page === page)
    ) {
      expenseCategories.fetchNextPage();
    }
  }, [expenseCategories, page]);
  if (expenseCategories.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <AddExpense
        modal={modal}
        setModal={setModal}
        onSubmit={async (inputs) => {
          return AddExpenseCategory.mutateAsync(inputs).then((res) => {
            // console.log(res);
          });
        }}
        onClose={() => {
          setModal(false);
          expenseCategories.refetch();
        }}
      />

      {Boolean(editId) && (
        <EditExpenseCategory
          _id={editId}
          onClose={() => {
            setEditId('');
            expenseCategories.refetch();
          }}
        />
      )}
      <Container>
        <Group my={'lg'} style={{ justifyContent: 'space-between' }}>
          <Title fw={300}>{t('expense category')}</Title>
          <Button
            size='xs'
            mr={'md'}
            onClick={() => {
              setModal(true);
            }}
          >
            {t('add category')}
          </Button>
        </Group>

        <TableSelection
          data={
            expenseCategories?.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((val) => ({
                ...val,
                _id: val._id.toString(),
              })) ?? []
          }
          colProps={{
            name: {
              label: `${t('name')}`,
            },
            description: {
              label: `${t('description')}`,
            },
          }}
          key='_id'
          deletable={true}
          editable={true}
          onDelete={(id) => {
            deleteCategory.mutateAsync({ _id: id }).then(() => {
              router.reload();
            });
          }}
          onEdit={(id) => setEditId(id)}
        />
        <Center>
          {(expenseCategories.data?.pages.find(
            (pageData) => pageData.page === page
          )?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                expenseCategories.data?.pages.find(
                  (pageData) => pageData.page === page
                )?.totalPages ?? 0
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
