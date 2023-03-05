import {
  SimpleGrid,
  Title,
  createStyles,
  Grid,
  Button,
  Image,
  Center,
  Container,
  ScrollArea,
  Group,
  ActionIcon,
  Stack,
  Text,
} from '@mantine/core';
import { Formik, Form, FieldArray } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import type { z } from 'zod';
import { ZCompanyCreateInput } from '@/zobjs/company';
import { IconMinus, IconPlus, IconUpload } from '@tabler/icons';
import { useRef } from 'react';
import FormikSelect from '../FormikCompo/FormikSelect';
import FormikColor from '../FormikCompo/FormikColor';
import ArrayInput from '../FormikCompo/ArrayInput';

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'dark',
    padding: '15px 20px',
    borderRadius: '5px',
    boxShadow: theme.shadows.xs,
  },
  profile: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: theme.shadows.sm,
    },
  },
  addressWrapper: {
    padding: '8px 13px',
  },
  containerStyles: {
    margin: 'auto',
    width: '100%',
  },
}));

export type CreateCompanyInput = z.infer<typeof ZCompanyCreateInput>;

interface Props {
  title: string;
  onSubmit: (inputs: CreateCompanyInput) => Promise<void>;
  formInputs: CreateCompanyInput;
}

const CompanyForm = ({ title, formInputs, onSubmit }: Props) => {
  const { classes, cx } = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <ScrollArea>
        <Title order={2}>{title}</Title>
        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(ZCompanyCreateInput)}
          // onSubmit={async (values, actions) => {
          //   console.log(values);
          //   await new Promise((resolve) => setTimeout(resolve, 1000));
          //   actions.resetForm();
          // }}
          onSubmit={onSubmit}
        >
          {({ values, isSubmitting, setFieldValue, errors, touched }) => {
            console.log(errors);
            console.log(touched, 'touched');

            return (
              <Form>
                <SimpleGrid
                  m={'md'}
                  cols={2}
                  className={classes.wrapper}
                  breakpoints={[
                    { maxWidth: 'md', cols: 2, spacing: 'md' },
                    { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                    { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                  ]}
                >
                  <FormInput
                    label='Company Name'
                    placeholder='Company Name'
                    name='name'
                    withAsterisk
                  />
                  <FormInput
                    label='email'
                    placeholder='email'
                    name='email'
                    withAsterisk
                  />

                  <FieldArray
                    name='numbers'
                    render={(arrayHelpers) => (
                      <div>
                        <label
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                          }}
                        >
                          Mobile
                        </label>
                        <Stack spacing='xs'>
                          {values.numbers.map((num, index) => (
                            <div key={index}>
                              <Group spacing={0}>
                                <ArrayInput
                                  name={`numbers.${index}`}
                                  placeholder='mobile'
                                  style={{
                                    flex: 1,
                                  }}
                                />
                                <Group spacing={1} ml={2}>
                                  <ActionIcon
                                    onClick={() => arrayHelpers.remove(index)}
                                    color='red'
                                    variant='light'
                                    size={'lg'}
                                    disabled={values.numbers.length === 1}
                                  >
                                    <IconMinus />
                                  </ActionIcon>
                                  <ActionIcon
                                    onClick={() => arrayHelpers.push('')}
                                    color='blue'
                                    variant='light'
                                    size={'lg'}
                                  >
                                    <IconPlus />
                                  </ActionIcon>
                                </Group>
                              </Group>
                              {
                                <Text size='xs' color='red'>
                                  {Array.isArray(touched.numbers) &&
                                    (touched.numbers as unknown as boolean[])[
                                      index
                                    ] &&
                                    errors.numbers &&
                                    errors.numbers[index]}
                                </Text>
                              }
                            </div>
                          ))}
                        </Stack>
                      </div>
                    )}
                  />
                </SimpleGrid>

                <Grid
                  m={'md'}
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={3}
                >
                  <Grid.Col lg={1} sm={3}>
                    <Container className={classes.containerStyles}>
                      <Center>
                        <Image
                          height={200}
                          width={200}
                          src={values.logo}
                          alt=''
                          withPlaceholder
                        />
                        <input
                          hidden
                          ref={fileRef}
                          type='file'
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (e.target.files) {
                              const file = e.target.files[0];
                              if (file) {
                                setFieldValue(
                                  'logo',
                                  URL.createObjectURL(file)
                                );
                              }
                            }
                          }}
                        />
                      </Center>
                      <Center>
                        <Button
                          leftIcon={
                            values.logo === '' && <IconUpload size={17} />
                          }
                          onClick={() => {
                            fileRef.current?.click();
                          }}
                          styles={{
                            root: {
                              margin: 2,
                            },
                          }}
                        >
                          {values.logo === '' ? `Upload` : `Change`}
                        </Button>
                      </Center>
                    </Container>
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      label='cin'
                      placeholder='cin'
                      name='cinNo'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormInput
                      label='gst'
                      placeholder='gst'
                      name='gstNo'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      label='PrimaryColor'
                      name='primaryColor'
                      placeholder='Primary Color'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      label='SecondaryColor'
                      name='secondaryColor'
                      placeholder='Secondary Color'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikColor
                      label='BackgroundColor'
                      name='backgroundColor'
                      placeholder='Background Color'
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={3}>
                    <FormikSelect
                      label='Nature of Business'
                      name='natureOfBusiness'
                      placeholder='Nature of Business'
                      data={[
                        { label: 'Manufacturing', value: 'Manufacturing' },
                        { label: 'Trading', value: 'Trading' },
                        { label: 'Service', value: 'Service' },
                      ]}
                    />
                  </Grid.Col>
                </Grid>

                {/* addess form */}
                <Grid
                  m={'md'}
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={4}
                >
                  <Grid.Col>
                    <Title order={4}>Address Info</Title>
                  </Grid.Col>
                  <Grid.Col lg={2} sm={4}>
                    <FormInput
                      label='Address line 1'
                      placeholder='Address line 1'
                      name='addressline1'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={2} sm={4}>
                    <FormInput
                      label='Address line 2'
                      placeholder='Address line 2'
                      name='addressline2'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={2}>
                    <FormInput
                      label='city'
                      placeholder='city'
                      name='city'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={2}>
                    <FormInput
                      label='state'
                      placeholder='state'
                      name='state'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={2}>
                    <FormInput
                      label='country'
                      placeholder='country'
                      name='country'
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col lg={1} sm={2}>
                    <FormInput
                      label='pincode'
                      placeholder='pincode'
                      name='pincode'
                      withAsterisk
                    />
                  </Grid.Col>
                </Grid>
                <Grid
                  m={'md'}
                  className={cx(classes.wrapper, {
                    [classes.addressWrapper]: true,
                  })}
                  columns={2}
                >
                  <Grid.Col>
                    <Button type='submit' loading={isSubmitting}>
                      Save
                    </Button>
                  </Grid.Col>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </ScrollArea>
    </div>
  );
};

export default CompanyForm;
