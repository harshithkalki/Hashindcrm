import CategoriesTable from '@/components/Tables/CategoriesTable';
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Modal,
  Title,
} from '@mantine/core';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { trpc } from '@/utils/trpc';
import convertToCategory from '@/utils/convertToCategory';
import axios from 'axios';

type InitialValues = {
  name: string;
  slug: string;
  logo: string;
  parentCategory?: string;
};

const initialValues: InitialValues = {
  name: '',
  slug: '',
  logo: '',
};

const Index = () => {
  const router = useRouter();

  const [modal, setModal] = React.useState(false);
  const createCategory = trpc.categoryRouter.create.useMutation();
  const allCategories = trpc.categoryRouter.getAllCategories.useQuery();

  const parsedData = useMemo(
    () =>
      convertToCategory(
        allCategories.data?.map((val) => ({
          _id: val._id.toString(),
          parentCategory: val.parentCategory as unknown as string,
          name: val.name,
          slug: val.slug,
          logo: val.logo,
          companyId: val.companyId as unknown as string,
        })) || []
      ),
    [allCategories.data]
  );

  const AddBrand = () => {
    const [logo, setLogo] = React.useState<File | null>(null);
    return (
      <>
        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title='Add Categories'
        >
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              const file = logo;
              if (file) {
                const form = new FormData();
                form.append('file', file);
                const { data } = await axios.post('/api/upload-file', form);
                values.logo = data.url;
              }

              if (!values.parentCategory) delete values.parentCategory;
              await createCategory.mutateAsync(values);
              actions.resetForm();
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormInput
                  name='name'
                  label='Name'
                  placeholder='Enter Name'
                  withAsterisk
                  mt={'md'}
                />
                <FormikSelect
                  name='parentCategory'
                  label='Parent Category'
                  data={
                    allCategories.data?.map((val) => {
                      return { label: val.name, value: val._id.toString() };
                    }) || []
                  }
                  placeholder='Enter Parent Category'
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
                  name='logo'
                  mt={'md'}
                  placeholder='Select Logo'
                  icon={<IconUpload size={14} />}
                  onChange={setLogo}
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

  if (allCategories.isLoading) return <div>Loading...</div>;

  return (
    <>
      <AddBrand />
      <Container mt={'xs'}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Categories</Title>
          <Button size='xs' onClick={() => setModal(true)}>
            Add Categories
          </Button>
        </Group>
        <Divider mt={'xl'} />
        <CategoriesTable data={parsedData} />
      </Container>
    </>
  );
};

export default Index;
