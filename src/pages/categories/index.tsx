import CategoriesTable from '@/components/Tables/CategoriesTable';
import {
  Button,
  Center,
  Container,
  FileButton,
  FileInput,
  Group,
  Loader,
  Modal,
  Pagination,
  Title,
} from '@mantine/core';
import React from 'react';
import FormInput from '@/components/FormikCompo/FormikInput';
import { Formik, Form } from 'formik';
import { IconUpload } from '@tabler/icons';
import FormikSelect from '@/components/FormikCompo/FormikSelect';
import { client, trpc } from '@/utils/trpc';
import axios from 'axios';
import Layout from '@/components/Layout';
import type { CategoryCreateInput } from '@/zobjs/category';
import { exportCSVFile } from '@/utils/jsonTocsv';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MIME_TYPES } from '@mantine/dropzone';
import csvtojson from 'csvtojson';

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
  const [page, setPage] = React.useState(1);
  const rootCategories = trpc.categoryRouter.getrootCategories.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: () => page,
      refetchOnWindowFocus: false,
    }
  );
  const createManyCategories = trpc.categoryRouter.createMany.useMutation();
  const utils = trpc.useContext();

  React.useEffect(() => {
    if (
      !rootCategories.data?.pages.find((pageData) => pageData.page === page)
    ) {
      rootCategories.fetchNextPage();
    }
  }, [rootCategories, page]);

  const [editId, setEditId] = React.useState<string | null>(null);

  if (rootCategories.isLoading) return <LoadingScreen />;

  return (
    <Layout>
      <AddCategory
        onClose={() => {
          setModal(false);
          rootCategories.refetch();
        }}
        opened={modal}
      />

      {editId && (
        <EditCategory
          onClose={() => {
            setEditId(null);
            rootCategories.refetch();
          }}
          _id={editId}
        />
      )}
      <Container h='100%' style={{ display: 'flex', flexDirection: 'column' }}>
        <Group style={{ justifyContent: 'space-between' }} my='lg'>
          <Title fw={400}>Categories</Title>
          <Group>
            <Button size='xs' onClick={() => setModal(true)}>
              Add Categories
            </Button>
            <Button
              size='xs'
              onClick={async () => {
                const data = await client.categoryRouter.getCsv.query();
                const headers: Record<keyof (typeof data)[number], string> = {
                  _id: 'ID',
                  name: 'name',
                  parentCategory: 'Parent Category Name',
                  parentCategory_id: 'parentCategory',
                  slug: 'slug',
                };

                exportCSVFile(headers, data, 'categories');
              }}
            >
              Download CSV
            </Button>
            <FileButton
              onChange={(file) => {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const csv = e.target?.result;
                  if (!csv) return;
                  const data = await csvtojson({
                    colParser: {
                      name: 'string',
                      parentCategory: 'string',
                      slug: 'string',
                    },
                  }).fromString(csv as string);
                  createManyCategories.mutateAsync(data);
                  utils.categoryRouter.getrootCategories.invalidate({
                    limit: 10,
                    cursor: 0,
                  });
                };
                reader.readAsText(file);
              }}
              accept={MIME_TYPES.csv}
            >
              {(props) => (
                <Button {...props} size='xs'>
                  Upload CSV
                </Button>
              )}
            </FileButton>
          </Group>
        </Group>
        <CategoriesTable
          data={
            rootCategories.data?.pages
              .find((pageData) => pageData.page === page)
              ?.docs.map((doc) => ({
                ...doc,
                _id: doc._id.toString(),
              })) || []
          }
          onEdit={setEditId}
        />
        <Center mb='lg'>
          {(rootCategories.data?.pages.find(
            (pageData) => pageData.page === page
          )?.totalPages ?? 0) > 1 && (
            <Pagination
              total={
                rootCategories.data?.pages.find(
                  (pageData) => pageData.page === page
                )?.totalPages ?? 0
              }
              initialPage={1}
              page={page}
              onChange={setPage}
            />
          )}
        </Center>
      </Container>
    </Layout>
  );
};

export default Index;
