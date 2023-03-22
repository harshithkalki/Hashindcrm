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
          taxname: '',
          taxrate: 0,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <FormInput
              name='taxname'
              label='Tax Name'
              placeholder='Enter Tax Name'
              withAsterisk
            />
            <FormInput
              name='taxrate'
              label='Tax Rate'
              placeholder='Enter Tax Rate'
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
    taxname: 'VAT',
    taxrate: 15,
  },
  {
    _id: 2,
    taxname: 'GST',
    taxrate: 10,
  },
  {
    _id: 3,
    taxname: 'Service Tax',
    taxrate: 5,
  },
];

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <AddTaxModal modal={modal} setModal={setModal} />
      <Container w={'100%'}>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Taxes</Title>
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
            taxname: {
              label: 'Tax Name',
            },
            taxrate: {
              label: 'Tax Rate',
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
