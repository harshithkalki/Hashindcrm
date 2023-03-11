import CategoriesTable from '@/components/Tables/CategoriesTable';
import {
  Button,
  Container,
  Divider,
  FileInput,
  Group,
  Loader,
  Modal,
  Title,
} from '@mantine/core';
import React, { useMemo } from 'react';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { trpc } from '@/utils/trpc';
import convertToCategory from '@/utils/convertToCategory';
import axios from 'axios';
import Layout from '@/components/Layout';
import type { CategoryCreateInput } from '@/zobjs/category';

const initialValues: CategoryCreateInput = {
  logo: '',
  name: '',
  slug: '',
  parentCategory: '',
};

const CategoryForm = ({
  onSubmit,
  values = initialValues,
  onClose,
}: {
  onSubmit: (values: CategoryCreateInput) => Promise<void>;
  values?: (CategoryCreateInput & { _id?: string }) | null;
  onClose: () => void;
}) => {
  const allCategories = trpc.categoryRouter.getAllCategories.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [logo, setLogo] = React.useState<File | null>(null);

  return (
    <Formik
      initialValues={values ?? initialValues}
      onSubmit={async (values, actions) => {
        const file = logo;
        if (file) {
          const form = new FormData();
          form.append('file', file);
          const { data } = await axios.post('/api/upload-file', form);
          values.logo = data.url;
        }

        if (values.parentCategory === '') {
          delete values.parentCategory;
        }

        if (values.logo === '') {
          delete values.logo;
        }

        await onSubmit(values);
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
              allCategories.data
                ?.filter((val) => val._id.toString() !== values?._id)
                .map((val) => {
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
          <Group mt={'md'} mb={'xs'} spacing={'md'}>
            <Button type='submit' mt={'md'} loading={isSubmitting} size={'sm'}>
              Submit
            </Button>
            <Button type='button' mt={'md'} size={'sm'} onClick={onClose}>
              Cancel
            </Button>
          </Group>
        </Form>
      )}
    </Formik>
  );
};

const AddCategory = ({
  onClose,
  opened,
}: {
  onClose: () => void;
  opened: boolean;
}) => {
  const createCategory = trpc.categoryRouter.create.useMutation();

  return (
    <>
      <Modal opened={opened} onClose={onClose} title='Add Categories'>
        <CategoryForm
          onSubmit={async (values) => {
            await createCategory.mutateAsync({
              ...values,
            });

            onClose();
          }}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};

const EditCategory = ({
  onClose,
  _id,
}: {
  onClose: () => void;
  _id: string;
}) => {
  const category = trpc.categoryRouter.get.useQuery(
    {
      _id,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const updateCategory = trpc.categoryRouter.update.useMutation();

  return (
    <Modal opened={Boolean(_id)} onClose={onClose} title='Edit Categories'>
      {category.isLoading ? (
        <Loader />
      ) : (
        <CategoryForm
          onSubmit={async (values) => {
            await updateCategory.mutateAsync({
              _id,
              ...values,
            });
            onClose();
          }}
          values={
            category.data
              ? {
                  ...category.data,
                  parentCategory: category.data.parentCategory?.toString(),
                  _id: category.data._id.toString(),
                }
              : null
          }
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

const Index = () => {
  const [modal, setModal] = React.useState(false);
  const allCategories = trpc.categoryRouter.getAllCategories.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [editId, setEditId] = React.useState<string | null>(null);

  const parsedData = useMemo(
    () =>
      convertToCategory(
        allCategories.data?.map((val) => ({
          _id: val._id.toString(),
          name: val.name,
          slug: val.slug,
          logo: val.logo,
          parentCategory: val.parentCategory?.toString(),
          company: val.company.toString(),
        })) || []
      ),
    [allCategories.data]
  );

  if (allCategories.isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <AddCategory
        onClose={() => {
          setModal(false);
          allCategories.refetch();
        }}
        opened={modal}
      />

      {editId && (
        <EditCategory
          onClose={() => {
            setEditId(null);
            allCategories.refetch();
          }}
          _id={editId}
        />
      )}
      <Container mt={'xs'}>
        <Group style={{ justifyContent: 'space-between' }}>
          <Title fw={400}>Categories</Title>
          <Button size='xs' onClick={() => setModal(true)}>
            Add Categories
          </Button>
        </Group>
        <Divider mt={'xl'} />
        <CategoriesTable data={parsedData} onEdit={setEditId} />
      </Container>
    </Layout>
  );
};

export default Index;
