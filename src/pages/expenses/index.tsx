import React from 'react';
import TableSelection from '@/components/Tables';
import {
  Button,
  Container,
  createStyles,
  FileInput,
  Group,
  Modal,
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

const ExpensesData = [
  {
    id: '1',
    expenseCategory: 'test',
    amount: 100,
    date: '2021-09-09',
    user: 'test',
  },
  {
    id: '2',
    expenseCategory: 'test',
    amount: 100,
    date: '2021-09-09',
    user: 'test',
  },
  {
    id: '3',
    expenseCategory: 'test',
    amount: 100,
    date: '2021-09-09',
    user: 'test',
  },
];

type CreateExpenseCategory = z.infer<typeof ZExpenseCreateInput>;

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (inputs: CreateExpenseCategory) => Promise<void>;
}

const AddExpense = ({ modal, setModal }: modalProps) => {
  const { classes, cx } = useStyles();
  const AddExpenseCategory = trpc.expenseRouter.create.useMutation();
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
            expensecategory: '',
            amount: '',
            date: '',
            user: '',
            expensebill: '',
            notes: '',
          }}
          validationSchema={toFormikValidationSchema(ZExpenseCreateInput)}
          onSubmit={(values) => {
            AddExpenseCategory.mutateAsync(values);
            setModal(false);
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
                <FormikSelect
                  name='expensecategory'
                  label='Expense Category'
                  placeholder='Select Expense Category'
                  searchable
                  data={[
                    { label: 'test1', value: 'test1' },
                    { label: 'test2', value: 'test2' },
                    { label: 'test3', value: 'test3' },
                  ]}
                  withAsterisk
                />
                <FormikSelect
                  name='user'
                  label='User'
                  placeholder='Select User'
                  searchable
                  data={[
                    { label: 'test1', value: 'test1' },
                    { label: 'test2', value: 'test2' },
                    { label: 'test3', value: 'test3' },
                  ]}
                />
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
                <FileInput
                  icon={<IconUpload size={14} />}
                  name='expensebill'
                  label='Expense Bill'
                  placeholder='Select Expense Bill'
                  withAsterisk
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

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout>
      <AddExpense modal={modal} setModal={setModal} />
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
            Add new
          </Button>
        </Group>
        <TableSelection
          data={ExpensesData}
          keysandlabels={{
            expenseCategory: 'Expense Category',
            amount: 'Amount',
            date: 'Date',
            user: 'User',
          }}
          deletable={true}
          editable={true}
          onDelete={(id) => console.log(id)}
          onEdit={(id) => console.log(id)}
        />
      </Container>
    </Layout>
  );
};

export default Index;
