import React, { useState } from 'react';
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
// import { ZExpenseCreateInput } from '@/zobjs/expense';
import { z } from 'zod';
import { trpc } from '@/utils/trpc';
import { ZExpenseCategoryCreateInput } from '@/zobjs/expenseCategory';
import { useRouter } from 'next/router';

const ExpensesCategoriesData = [
  {
    id: '1',
    expensecategoryname: 'test',
    description: 'test',
  },
  {
    id: '2',
    expensecategoryname: 'test2',
    description: 'test2',
  },
  {
    id: '3',
    expensecategoryname: 'test3',
    description: 'test3',
  },
  {
    id: '4',
    expensecategoryname: 'test4',
    description: 'test4',
  },
];

type CreateExpenseCategory = z.infer<typeof ZExpenseCategoryCreateInput>;

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (inputs: CreateExpenseCategory) => Promise<void>;
  onClose: () => void;
}

const AddExpense = ({ modal, setModal, onSubmit, onClose }: modalProps) => {
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
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <FormInput
                name='name'
                label='Expense Category Name'
                placeholder='Enter Expense Category Name'
                withAsterisk
                mb={'sm'}
              />
              <Formiktextarea
                name='description'
                label='Description'
                placeholder='Enter Description'
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

const EditExpenseCategory = ({
  onClose,
  _id,
}: {
  _id: string;
  onClose: () => void;
}) => {
  const updateExpenseCategory = trpc.expenseCategoryRouter.update.useMutation();
  const expenseCategory = trpc.expenseCategoryRouter.get.useQuery({ _id: _id });

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
            onClose();
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <FormInput
                name='name'
                label='Expense Category Name'
                placeholder='Enter Expense Category Name'
                withAsterisk
                mb={'sm'}
              />
              <Formiktextarea
                name='description'
                label='Description'
                placeholder='Enter Description'
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
  const AddExpenseCategory = trpc.expenseCategoryRouter.create.useMutation();
  const allExpenseCategory =
    trpc.expenseCategoryRouter.expenseCategorys.useQuery({
      page: page,
    });
  const deleteCategory = trpc.expenseCategoryRouter.delete.useMutation();
  // console.log(allExpenseCategory.data);
  const tabData = allExpenseCategory.data;
  const [editId, setEditId] = useState<string>('');
  const router = useRouter();
  const Data = tabData;
  if (allExpenseCategory.isLoading)
    return (
      <Center h='100%'>
        <Loader />
      </Center>
    );

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
          allExpenseCategory.refetch();
        }}
      />

      {Boolean(editId) && (
        <EditExpenseCategory
          _id={editId}
          onClose={() => {
            setEditId('');
            allExpenseCategory.refetch();
          }}
        />
      )}
      <Container>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={300}>Expenses Category</Title>
          <Button
            size='xs'
            mr={'md'}
            onClick={() => {
              setModal(true);
            }}
          >
            Add new
          </Button>
        </Group>
        {allExpenseCategory.isLoading ? (
          <Loader />
        ) : (
          <>
            <TableSelection
              data={Data?.docs}
              keysandlabels={{
                name: 'Expense Category Name',
                description: 'Description',
              }}
              key='_id'
              deletable={true}
              editable={true}
              onDelete={(id) => {
                deleteCategory.mutateAsync({ _id: id }).then(() => {
                  router.reload();
                });
              }}
              // onEdit={(id) => console.log(id)}
              onEdit={(id) => setEditId(id)}
            />
            <Pagination
              total={allExpenseCategory.data?.totalPages || 0}
              initialPage={1}
              // {...pagination}
              page={page}
              onChange={setPage}
            />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Index;
