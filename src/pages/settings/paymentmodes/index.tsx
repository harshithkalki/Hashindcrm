import FormInput from '@/components/FormikCompo/FormikInput';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
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
          modename: '',
          modetype: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <FormInput
              name='modename'
              label='Mode Name'
              placeholder='Enter Mode Name'
              withAsterisk
            />
            <FormikSelect
              name='modetype'
              label='Mode Type'
              placeholder='Select Mode Type'
              withAsterisk
              mt={'md'}
              data={[
                {
                  label: 'Cash',
                  value: 'cash',
                },
                {
                  label: 'Card',
                  value: 'card',
                },
                {
                  label: 'upi',
                  value: 'upi',
                },
              ]}
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
    modename: 'Cash',
    modetype: 'cash',
  },
  {
    _id: 2,
    modename: 'Card',
    modetype: 'card',
  },
  {
    _id: 3,
    modename: 'UPI',
    modetype: 'upi',
  },
];

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <AddTaxModal modal={modal} setModal={setModal} />
      <Container w={'100%'}>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Payment Modes</Title>
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
          data={data}
          keysandlabels={{
            modename: 'Mode Name',
            modetype: 'Mode Type',
          }}
          editable={true}
          deletable={true}
        />
      </Container>
    </Layout>
  );
};

export default Index;
