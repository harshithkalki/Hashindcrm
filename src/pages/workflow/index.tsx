// import type { ModalProps } from '@mantine/core';
// import { ScrollArea } from '@mantine/core';
// import {
//   ActionIcon,
//   Button,
//   Container,
//   Divider,
//   Group,
//   Modal,
//   MultiSelect,
//   Table,
//   Title,
// } from '@mantine/core';
// import React, { useState } from 'react';
// import { IconPencil } from '@tabler/icons';
// import { z } from 'zod';
// import { Form, Formik } from 'formik';
// import { toFormikValidationSchema } from 'zod-formik-adapter';
// import FormInput from '@/components/FormikCompo/FormikInput';
// import FormikSwitch from '@/components/FormikCompo/FormikSwitch';
// import type { RouterOutputs } from '@/utils/trpc';
// import { trpc } from '@/utils/trpc';
// import FormikSelect from '@/components/FormikCompo/FormikSelect';
import Layout from '@/components/Layout';

// const LinkStatus = ({
//   modalProps,
//   data = [],
// }: {
//   modalProps: ModalProps;
//   data?: { value: string; label: string }[];
// }) => {
//   const createLink = trpc.workflowRouter.createLink.useMutation();

//   console.log(createLink.error);
//   console.log(createLink.data);

//   return (
//     <Modal {...modalProps} title='Link Status'>
//       <Formik
//         initialValues={{ target: '', linkedStatus: '' }}
//         onSubmit={(values, { setSubmitting }) => {
//           createLink
//             .mutateAsync({
//               linkedStatus: values.linkedStatus,
//               target: values.target,
//             })
//             .then(() => setSubmitting(false));
//         }}
//         validationSchema={toFormikValidationSchema(
//           z.object({
//             target: z.string(),
//             linkedStatus: z.string(),
//           })
//         )}
//       >
//         {({ isSubmitting, values }) => (
//           <Form>
//             <FormikSelect
//               name='target'
//               data={data}
//               searchable
//               placeholder='Search Status'
//               clearable
//             />
//             <FormikSelect
//               name='linkedStatus'
//               data={data.filter((val) => {
//                 return val.value !== values.target;
//               })}
//               placeholder='Search status to link'
//               searchable
//               mt='md'
//               disabled={!values.target}
//               clearable
//             />
//             <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
//               save
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// const RemoveLink = ({
//   modalProps,
//   data = [],
// }: {
//   modalProps: ModalProps;
//   data?: RouterOutputs['workflowRouter']['getWorkflow'];
// }) => {
//   const createLink = trpc.workflowRouter.removeLink.useMutation();

//   return (
//     <Modal {...modalProps} title='Remove Link'>
//       <Formik
//         initialValues={{ target: '', linkedStatus: '' }}
//         onSubmit={(values, { setSubmitting }) => {
//           createLink
//             .mutateAsync({
//               linkedStatus: values.linkedStatus,
//               target: values.target,
//             })
//             .then(() => setSubmitting(false));
//         }}
//         validationSchema={toFormikValidationSchema(
//           z.object({
//             target: z.string(),
//             linkedStatus: z.string(),
//           })
//         )}
//       >
//         {({ isSubmitting, values }) => (
//           <Form>
//             <FormikSelect
//               name='target'
//               data={data.map((val) => ({ value: val.id, label: val.name }))}
//               searchable
//               placeholder='Search Status'
//               clearable
//             />
//             <FormikSelect
//               name='linkedStatus'
//               data={
//                 data
//                   .find((val) => val.id === values.target)
//                   ?.linkedStatuses.map((val) => ({
//                     value: val.value,
//                     label: val.name,
//                   })) || []
//               }
//               placeholder='Search status to remove'
//               searchable
//               mt='md'
//               disabled={!values.target}
//               nothingFound='No Linked Statuses'
//               clearable
//             />
//             <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
//               save
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// const WorkFlowTable = () => {
//   const [open, setOpen] = React.useState(false);
//   const createStatus = trpc.workflowRouter.createStatus.useMutation();
//   const workflow = trpc.workflowRouter.getWorkflow.useQuery();
//   const [link, setLink] = useState(false);
//   const [remove, setRemove] = useState(false);

//   const Ddata = [
//     {
//       name: 'New',
//       initial: true,
//       linked: ['New', 'InProgress', 'Completed'],
//     },
//     {
//       name: 'In Progress',
//       initial: false,
//       linked: [
//         'New',
//         'InProgress',
//         'Completed',
//         'Cancelled',
//         'On Hold',
//         'Done',
//         'Rejected',
//         'Approved',
//         'Pending',
//       ],
//     },
//     {
//       name: 'Completed',
//       initial: false,
//       linked: ['New', 'In Progress', 'Completed'],
//     },
//   ];

//   return (
//     <>
//       <Modal
//         opened={open}
//         title='New Status'
//         onClose={() => {
//           setOpen(false);
//         }}
//       >
//         <Formik
//           initialValues={{ name: '', initial: false }}
//           onSubmit={(values, { setSubmitting }) => {
//             createStatus
//               .mutateAsync({
//                 initialStatus: values.initial,
//                 name: values.name,
//               })
//               .then((res) => {
//                 setSubmitting(false);
//                 console.log(res);
//               });
//           }}
//           validationSchema={toFormikValidationSchema(
//             z.object({
//               name: z.string(),
//               initial: z.boolean(),
//             })
//           )}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <FormInput
//                 name='name'
//                 label='Name'
//                 placeholder='Enter Name'
//                 withAsterisk
//               />
//               <FormikSwitch
//                 name='initial'
//                 label='Initial State'
//                 mt={'sm'}
//               ></FormikSwitch>
//               <Button type='submit' size='xs' mt={'md'} loading={isSubmitting}>
//                 save
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </Modal>
//       <Container
//         w={'100%'}
//         h='100%'
//         p={0}
//         style={{ display: 'flex', flexDirection: 'column' }}
//       >
//         <div
//         // style={{
//         //   position: "sticky",
//         //   top: "0",
//         //   zIndex: "1",
//         //   background: "#141517",
//         // }}
//         >
//           <Title size={30} fw={400}>
//             WorkFlow
//           </Title>
//           <Group h={'10vh'}>
//             <Button size='xs' onClick={() => setOpen(true)}>
//               Add status
//             </Button>
//             <Button size='xs' onClick={() => setLink(true)}>
//               Link status
//             </Button>
//             <Button size='xs' onClick={() => setRemove(true)}>
//               Remove Link
//             </Button>
//           </Group>
//         </div>
//         {/* <Divider mb={"md"}></Divider> */}

//         <ScrollArea style={{ flex: '1' }}>
//           <Table width={'100%'} h='100%'>
//             <thead>
//               <tr style={{ textAlign: 'center' }}>
//                 <th style={{ textAlign: 'center' }}>Sno</th>
//                 <th style={{ textAlign: 'center' }}>Name</th>
//                 <th style={{ textAlign: 'center' }}>Initial State</th>
//                 <th style={{ textAlign: 'center' }}>Linked</th>
//               </tr>
//             </thead>
//             <tbody>
//               {workflow.data?.map((data, index) => (
//                 <tr key={index} style={{ height: '10vh', textAlign: 'center' }}>
//                   <td style={{ width: '8%' }}>{index + 1}</td>
//                   <td style={{ width: '18%' }}>{data.name}</td>
//                   <td style={{ width: '15%' }}>
//                     {data.initialStatus ? 'Yes' : 'No'}
//                   </td>
//                   <td style={{ width: '55%' }}>
//                     <form>
//                       <MultiSelect
//                         data={data.linkedStatuses.map((val) => ({
//                           value: val.value,
//                           label: val.name,
//                         }))}
//                         defaultValue={data.linkedStatuses.map(
//                           (val) => val.value
//                         )}
//                         readOnly
//                       ></MultiSelect>
//                     </form>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </ScrollArea>
//         <LinkStatus
//           modalProps={{ opened: link, onClose: () => setLink(false) }}
//           data={workflow.data?.map((val) => ({
//             value: val.id,
//             label: val.name,
//           }))}
//         />
//         <RemoveLink
//           modalProps={{ opened: remove, onClose: () => setRemove(false) }}
//           data={workflow.data}
//         />
//       </Container>
//     </>
//   );
// };

const index = () => {
  return (
    <Layout>
      {/* <NoWorkflow /> */}
      {/* <WorkFlowTable /> */}
    </Layout>
  );
};

export default index;
