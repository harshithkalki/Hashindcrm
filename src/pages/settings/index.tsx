import Layout from '@/components/Layout';
import React from 'react';
import SettingsNav from '@/components/SettingsNav';
import {
  Button,
  Container,
  createStyles,
  Flex,
  Grid,
  ScrollArea,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import FormInput from '@/components/FormikCompo/FormikInput';
import FormDate from '@/components/FormikCompo/FormikDate';
import Formiktextarea from '@/components/FormikCompo/FormikTextarea';

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

const Index = () => {
  const { classes, cx } = useStyles();
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <Flex style={{ flexDirection: 'column' }}>
        <ScrollArea style={{ height: '80vh' }}>
          <Container>
            <Formik
              initialValues={{
                maker: '',
                model: '',
                purchaseDate: '',
                registrationNumber: '',
                vehicleType: '',
                meterReading: '',
                wheelDriveType: '',
                fuelType: '',
                transmissionType: '',
                emissionType: '',
                insuranceDate: '',
                insurancePeriod: '',
                renewalDate: '',
                interiorColor: '',
                exteriorColor: '',
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ handleSubmit }) => (
                <Form>
                  <SimpleGrid
                    m={'md'}
                    cols={3}
                    className={classes.wrapper}
                    breakpoints={[
                      { maxWidth: 'md', cols: 3, spacing: 'md' },
                      { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                      { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                    ]}
                    style={{ alignItems: 'end' }}
                  >
                    <FormInput
                      name='maker'
                      label='Maker'
                      placeholder='Maker'
                      type='text'
                    />
                    <FormInput
                      name='model'
                      label='Model'
                      placeholder='Model'
                      type='text'
                    />
                    <FormDate
                      name='purchaseDate'
                      label='Purchase Date'
                      placeholder='Purchase Date'
                      type='text'
                    />
                    <FormInput
                      name='registrationNumber'
                      label='Registration Number'
                      placeholder='Registration Number'
                      type='text'
                    />
                    <FormInput
                      name='vehicleType'
                      label='Vehicle Type'
                      placeholder='Vehicle Type'
                      type='text'
                    />
                    <FormInput
                      name='meterReading'
                      label='Meter Reading'
                      placeholder='Meter Reading'
                      type='text'
                    />
                  </SimpleGrid>
                  <Grid
                    m={'md'}
                    className={cx(classes.wrapper, {
                      [classes.addressWrapper]: true,
                    })}
                    columns={3}
                  >
                    <Grid.Col>
                      <Title order={3}>Color</Title>
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='interiorColor'
                        label='Interior Color'
                        placeholder='Interior Color'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='exteriorColor'
                        label='Exterior Color'
                        placeholder='Exterior Color'
                        type='text'
                      />
                    </Grid.Col>
                  </Grid>
                  <Grid
                    m={'md'}
                    className={cx(classes.wrapper, {
                      [classes.addressWrapper]: true,
                    })}
                    columns={3}
                  >
                    <Grid.Col>
                      <Title order={3}>Specifications</Title>
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='wheelDriveType'
                        label='Wheel Drive Type'
                        placeholder='Wheel Drive Type'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='fuelType'
                        label='Fuel Type'
                        placeholder='Fuel Type'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='transmissionType'
                        label='Transmission Type'
                        placeholder='Transmission Type'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='emissionType'
                        label='Emission Type'
                        placeholder='Emission Type'
                        type='text'
                      />
                    </Grid.Col>

                    <Grid.Col lg={1} sm={3}>
                      <FormDate
                        name='insuranceDate'
                        label='Insurance Date'
                        placeholder='Insurance Date'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormInput
                        name='insurancePeriod'
                        label='Insurance Period'
                        placeholder='Insurance Period'
                        type='text'
                      />
                    </Grid.Col>
                    <Grid.Col lg={1} sm={3}>
                      <FormDate
                        name='renewalDate'
                        label='Renewal Date'
                        placeholder='Renewal Date'
                        type='text'
                      />
                    </Grid.Col>
                  </Grid>
                  <Button type='submit'>Submit</Button>
                </Form>
              )}
            </Formik>
          </Container>
        </ScrollArea>
      </Flex>
    </Layout>
  );
};

export default Index;
