import { useState } from 'react';
import type { GroupProps } from '@mantine/core';
import { Button, FileInput, Modal } from '@mantine/core';
import { Image } from '@mantine/core';
import { Container } from '@mantine/core';
import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash, IconUpload } from '@tabler/icons';
import { ZBrandCreateInput } from '@/zobjs/brand';
import axios from 'axios';
import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '../FormikCompo/FormikInput';
import { trpc } from '@/utils/trpc';

interface Product {
  id: string;
  slug: string;
  companyID: string;
  name: string;
  logo: string;
}
interface TableSelectionProps<T> {
  data: Product[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

interface modalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const AddBrand = ({ modal, setModal, id }: modalProps) => {
  const [logo, setLogo] = useState<File | null>(null);
  const initialValues = trpc.brandRouter.get.useQuery({ _id: id });

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

            // await createBrand.mutateAsync({
            //   ...values,
            //   // logo: 'https://cdn.mos.cms.futurecdn.net/6ZQ7Q2Z7Q4Z2Q2Z7Q4Z2Q2Z7-1200-80.jpg.webp',
            // });
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

export default function BrandsTableSelection<T>({
  data,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [id, setId] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some((field) =>
          String(field)
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim())
        )
      )
    );
  };

  const rows = filteredData.map((item) => {
    return (
      <tr key={item.id}>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Image
            src={item.logo}
            alt={'brand'}
            radius='lg'
            style={{ width: 32, height: 32 }}
          />
          {/* {item.name} */}
        </td>
        <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {item.name}
        </td>

        <td>
          <Group spacing={0} {...groupProps}>
            <ActionIcon
              onClick={() => {
                setId(item.id);
                setModal(true);
              }}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>

            <ActionIcon
              color='red'
              onClick={() => {
                onDelete && onDelete(item.id);
              }}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <AddBrand modal={modal} setModal={setModal} id={id} />
      <TextInput
        placeholder='Search by any field'
        mb='md'
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea
        style={{
          height: '100%',
        }}
      >
        <Container>
          <Table sx={{ minWidth: '100%' }} verticalSpacing='sm'>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Logo
                </th>

                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Name
                </th>

                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      </ScrollArea>
    </>
  );
}
