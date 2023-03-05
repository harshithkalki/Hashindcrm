import React from 'react';
import TableSelection from '@/components/Tables';
import { Button, Container, Group, Modal, Title } from '@mantine/core';

import { Form, Formik } from 'formik';
import FormInput from '@/components/FormikCompo/FormikInput';

import Formiktextarea from '@/components/FormikCompo/FormikTextarea';
import Layout from '@/components/Layout';

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

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddExpense = ({ modal, setModal }: modalProps) => {
  return (
    <>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        title='Add Expense Category'
      >
        <Formik
          initialValues={{
            expensecategoryname: '',
            description: '',
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <FormInput
                name='expensecategoryname'
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

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout>
      <AddExpense modal={modal} setModal={setModal} />
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
        <TableSelection
          data={ExpensesCategoriesData}
          keysandlabels={{
            expensecategoryname: 'Expense Category Name',
            description: 'Description',
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
