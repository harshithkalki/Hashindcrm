import TableSelection from '@/components/Tables';
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import { trpc } from '@/utils/trpc';
import axios from 'axios';
import Layout from '@/components/Layout';
import BrandsTableSelection from '@/components/Tables/BrandsTable';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { BrandCreateInput } from '@/zobjs/brand';
import { ZBrandCreateInput } from '@/zobjs/brand';

interface Product {
  id: string;
  slug: string;
  companyID: string;
  name: string;
  logo: string;
}

const initialValues: BrandCreateInput = {
  name: '',
  slug: '',
  logo: '',
};

const Index = () => {
  const router = useRouter();
  const [modal, setModal] = React.useState(false);
  const createBrand = trpc.brandRouter.create.useMutation();
  const brands = trpc.brandRouter.brands.useQuery();
  // const [id,setId]=useState<string>('');
  const AddBrand = () => {
    const [logo, setLogo] = useState<File | null>(null);
    // const getBrand=trpc.brandRouter.get.useQuery({_id:});

    return (
      <>
        <Modal opened={modal} onClose={() => setModal(false)} title='Add Brand'>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(ZBrandCreateInput)}
            onSubmit={async (values, actions) => {
              const file = logo;
              if (file) {
                const form = new FormData();
                form.append('file', file);
                const { data } = await axios.post('/api/upload-file', form);
                values.logo = data.url;
              }

              await createBrand.mutateAsync({
                ...values,
                // logo: 'https://cdn.mos.cms.futurecdn.net/6ZQ7Q2Z7Q4Z2Q2Z7Q4Z2Q2Z7-1200-80.jpg.webp',
              });
              actions.resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormInput
                  name={'name'}
                  label='Name'
                  placeholder='Enter Name'
                  withAsterisk
                  mt={'md'}
                />
                <FormInput
                  name='slug'
                  label='Slug'
                  placeholder='Enter Slug'
                  withAsterisk
                  mt={'xs'}
                />
                <FileInput
                  label='Logo'
                  onChange={setLogo}
                  name='logo'
                  mt={'md'}
                  placeholder='Select Logo'
                  icon={<IconUpload size={14} />}
                />
                <Group style={{ justifyContent: 'end' }} mt={'md'} mb={'xs'}>
                  <Button
                    type='submit'
                    mt={'md'}
                    loading={isSubmitting}
                    size={'sm'}
                  >
                    Submit
                  </Button>
                  <Button mt={'md'} onClick={() => setModal(false)} size={'sm'}>
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

  if (brands.isLoading) return <div>Loading...</div>;
  // const data =
  //   brands.data?.map((val) => ({ id: val._id.toString(), name: val.name })) ||
  //   [];
  // console.log('brands Data');
  // console.log(brands.data);

  return (
    <Layout>
      <AddBrand />
      <Container mt={'xs'}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Brands</Title>
          <Button size='xs' onClick={() => setModal(true)}>
            Add Brand
          </Button>
        </Group>
        <Divider mt={'xl'} />

        <BrandsTableSelection
          data={
            brands.data?.docs.map((val) => ({
              ...val,
              id: val._id.toString(),
            })) as unknown as Product[]
          }
        />
      </Container>
    </Layout>
  );
};

export default Index;
