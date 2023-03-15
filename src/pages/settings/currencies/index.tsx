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
          currencyname: '',
          currencycode: '',
          currencysymbol: '',
          currencypoistion: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form>
            <FormInput
              name='currencyname'
              label='Currency Name'
              placeholder='Enter Currency Name'
              withAsterisk
            />
            <FormInput
              name='currencycode'
              label='Currency Code'
              placeholder='Enter Currency Code'
              withAsterisk
              mt={'md'}
            />
            <FormInput
              name='currencysymbol'
              label='Currency Symbol'
              placeholder='Enter Currency Symbol'
              withAsterisk
              mt={'md'}
            />
            <FormikSelect
              name='currencypoistion'
              label='Currency Position'
              placeholder='Select Currency Position'
              withAsterisk
              mt={'md'}
              data={[
                {
                  label: 'Front',
                  value: 'front',
                },
                {
                  label: 'Back',
                  value: 'back',
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
    currencyname: 'Naira',
    currencycode: 'NGN',
    currencysymbol: '₦',
    currencypoistion: 'front',
  },
  {
    _id: 2,
    currencyname: 'Dollar',
    currencycode: 'USD',
    currencysymbol: '$',
    currencypoistion: 'front',
  },
  {
    _id: 3,
    currencyname: 'Pound',
    currencycode: 'GBP',
    currencysymbol: '£',
    currencypoistion: 'front',
  },
];

const Index = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <AddTaxModal modal={modal} setModal={setModal} />
      <Container w={'100%'}>
        <Group mb={'md'} style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Currencies</Title>
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
          colProps={{
            currencyname: {
              label: 'Currency Name',
            },
            currencycode: {
              label: 'Currency Code',
            },
            currencysymbol: {
              label: 'Currency Symbol',
            },
            currencypoistion: {
              label: 'Currency Position',
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
