import FormInput from '@/components/FormikCompo/FormikInput';
import Layout from '@/components/Layout';
import SettingsNav from '@/components/SettingsNav';
import TableSelection from '@/components/Tables';
import { Button, Container, Group, Modal, Title } from '@mantine/core';
import { Form, Formik } from 'formik';
import React from 'react';
interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTaxModal = ({ modal, setModal }: modalProps) => {
  return (
    <Modal
      opened={modal}
      onClose={() => setModal(false)}
      title='Add Tax'
      // size={'50%'}
    >
      <Formik
        initialValues={{
          unitname: '',
          shortname: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <FormInput
              name='unitname'
              label='Unit Name'
              placeholder='Enter Unit Name'
              withAsterisk
            />
            <FormInput
              name='shortname'
              label='Short Name'
              placeholder='Enter Short Name'
              withAsterisk
              mt={'md'}
            />
            <Button type='submit' mt={'xl'}>
              Submit{' '}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const data = [
  {
    _id: 1,
    unitname: 'Kilogram',
    shortname: 'Kg',
  },
  {
    _id: 2,
    unitname: 'Gram',
    shortname: 'g',
  },
  {
    _id: 3,
    unitname: 'Milligram',
    shortname: 'mg',
  },
];

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <AddTaxModal modal={modal} setModal={setModal} />
      <Container w={'100%'}>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Units</Title>
          <Button
            size='xs'
            mr={'md'}
            onClick={() => {
              setModal(true);
            }}
          >
            Add
          </Button>
        </Group>
        <TableSelection
          data={data.map((item) => {
            return {
              ...item,
              _id: item._id.toString(),
            };
          })}
          colProps={{
            unitname: {
              label: 'Unit Name',
            },
            shortname: {
              label: 'Short Name',
            },
          }}
          editable={true}
          deletable={true}
        />
      </Container>
    </Layout>
  );
};

export default Index;
