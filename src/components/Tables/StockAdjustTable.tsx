import { useState } from 'react';
import type { GroupProps } from '@mantine/core';
import { Button, Modal } from '@mantine/core';
import { Image } from '@mantine/core';
import { Container } from '@mantine/core';
import { Table, ScrollArea, TextInput, ActionIcon, Group } from '@mantine/core';
import { IconSearch, IconTrash } from '@tabler/icons';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '../FormikCompo/FormikInput';
import FormikSelect from '../FormikCompo/FormikSelect';
import Formiktextarea from '../FormikCompo/FormikTextarea';
import type { RouterOutputs } from '@/utils/trpc';

interface TableSelectionProps<T> {
  data: RouterOutputs['stockAdjustRouter']['getAllStockAdjusts'];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  editDeleteColumnProps?: {
    groupProps?: GroupProps;
  };
}

// interface AdjustForm {
//   data: ;
// }

export default function StockadjustmentTable<T>({
  data,
  onDelete,
  onEdit,
  editDeleteColumnProps: { groupProps } = {},
}: TableSelectionProps<T>) {
  const [filteredData, setFilteredData] = useState(data);
  const [modal, setModal] = useState(false);
  const [sData, setSData] = useState({
    id: '',
    name: '',
    currentStock: 0,
    quantity: 0,
    adjustment: '',
    note: '',
  });

  const [search, setSearch] = useState('');

  // const AdjustForm = ({ data }: AdjustForm) => {
  //   return (
  //     <>
  //       <Modal
  //         onClose={() => setModal(false)}
  //         opened={modal && sData !== undefined}
  //         title={'Edit Adjustment'}
  //       >
  //         <Formik
  //           initialValues={
  //             data || {
  //               name: '',
  //               currentStock: 0,
  //               quantity: 0,
  //               adjustment: '',
  //               note: '',
  //             }
  //           }
  //           onSubmit={(values) => {
  //             console.log(values);
  //           }}
  //           validationSchema={toFormikValidationSchema(
  //             z.object({
  //               name: z.string(),
  //               quantity: z.number(),
  //               adjustment: z.string(),
  //               note: z.string().optional(),
  //             })
  //           )}
  //         >
  //           {({ values, handleSubmit }) => (
  //             <Form onSubmit={handleSubmit}>
  //               <FormikSelect
  //                 mt={'md'}
  //                 name='name'
  //                 label='Product Name'
  //                 searchable
  //                 creatable
  //                 data={[
  //                   { label: 'Product 1', value: 'Product 1' },
  //                   { label: 'Product 2', value: 'Product 2' },
  //                   { label: 'Product 3', value: 'Product 3' },
  //                 ]}
  //                 placeholder='Select Product'
  //                 withAsterisk
  //               />
  //               <Group mt={'md'}>
  //                 <TextInput
  //                   name='currentStock'
  //                   value={values.currentStock}
  //                   label='Current Stock'
  //                   disabled
  //                 />
  //                 <FormInput
  //                   name='quantity'
  //                   label='Quantity'
  //                   placeholder='Quantity'
  //                   type='number'
  //                   withAsterisk
  //                 />
  //               </Group>
  //               <FormikSelect
  //                 name='adjustment'
  //                 label='Adjustment'
  //                 mt={'md'}
  //                 data={[
  //                   { label: 'Add', value: 'add' },
  //                   { label: 'Remove', value: 'remove' },
  //                 ]}
  //                 placeholder='Select Adjustment'
  //                 withAsterisk
  //               />
  //               <Formiktextarea
  //                 name='note'
  //                 label='Note'
  //                 placeholder='Note'
  //                 mt={'md'}
  //               />
  //               <Button type='submit' mt={'lg'}>
  //                 Submit
  //               </Button>
  //             </Form>
  //           )}
  //         </Formik>
  //       </Modal>
  //     </>
  //   );
  // };

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
    console.log(item);
    return (
      <>
        <tr key={item._id.toString()}>
          <td style={{ whiteSpace: 'nowrap' }}>{item._id.toString()}</td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            <Group spacing='xs'>
              <Image
                src={item.productId.logo}
                alt={item.productId.name}
                radius='lg'
                style={{ width: 32, height: 32 }}
              />
              {item.productId.name}
            </Group>
          </td>
          <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
            {item.quantity}
          </td>
          <td>
            <Group
              spacing={0}
              {...groupProps}
              style={{ justifyContent: 'center' }}
            >
              <ActionIcon
                color='red'
                onClick={() => {
                  onDelete && onDelete(item.productId._id);
                }}
              >
                <IconTrash size={16} stroke={1.5} />
              </ActionIcon>
            </Group>
          </td>
        </tr>
      </>
    );
  });

  return (
    <>
      {/* <AdjustForm data={sData} /> */}
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
                <th style={{ whiteSpace: 'nowrap' }}>#</th>
                <th style={{ whiteSpace: 'nowrap' }}>Name</th>
                <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  Quantity
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
