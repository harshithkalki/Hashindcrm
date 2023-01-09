import { SimpleGrid, Title, createStyles, Grid, Button } from "@mantine/core";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@/components/FormikCompo/FormikInput";
import { z } from "zod";
// import { trpc } from "@/utils/trpc";
// import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
// import FormikSelect from "@/components/FormikCompo/FormikSelect";
const useStyles = createStyles((theme) => ({
  wrapper: {
    background: "dark",
    padding: "15px 20px",
    borderRadius: "5px",
    boxShadow: theme.shadows.xs,
  },
  profile: {
    cursor: "pointer",
    ":hover": {
      boxShadow: theme.shadows.sm,
    },
  },
  addressWrapper: {
    padding: "8px 13px",
  },
}));

export interface Company {
  companyName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// const onSubmit = async (values: Company, actions: any) => {
//   console.log(values);
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   actions.resetForm();
// };

interface Props {
  title: string;
  onSubmit: (inputs: Company) => Promise<void>;
  formInputs: Company;
}

const CompanyForm = ({ title, formInputs, onSubmit }: Props) => {
  const { classes, cx } = useStyles();

  return (
    <div>
      <Title order={2}>{title}</Title>
      <Formik
        initialValues={formInputs}
        validationSchema={toFormikValidationSchema(
          z.object({
            companyName: z.string(),
            email: z.string().email({ message: "Please enter valid email" }),
            addressLine1: z.string(),
            addressLine2: z.string(),
            city: z.string(),
            state: z.string(),
            country: z.string(),
            pincode: z.string(),
          })
        )}
        // onSubmit={(values, { setSubmitting }) => {
        //   onSubmit(values).then(() => setSubmitting(false));
        // }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <SimpleGrid
                m={"md"}
                cols={2}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: "md", cols: 2, spacing: "md" },
                  { maxWidth: "sm", cols: 2, spacing: "sm" },
                  { maxWidth: "xs", cols: 1, spacing: "sm" },
                ]}
              >
                <FormInput
                  label="Company Name"
                  placeholder="Company Name"
                  name="companyName"
                  withAsterisk
                />
                <FormInput
                  label="email"
                  placeholder="email"
                  name="email"
                  withAsterisk
                />
              </SimpleGrid>
              {/* addess form */}
              <Grid
                m={"md"}
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
                    label="Address line 1"
                    placeholder="Address line 1"
                    name="addressLine1"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={2} sm={4}>
                  <FormInput
                    label="Address line 2"
                    placeholder="Address line 2"
                    name="addressLine2"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={2}>
                  <FormInput
                    label="city"
                    placeholder="city"
                    name="city"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={2}>
                  <FormInput
                    label="state"
                    placeholder="state"
                    name="state"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={2}>
                  <FormInput
                    label="country"
                    placeholder="country"
                    name="country"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={2}>
                  <FormInput
                    label="pincode"
                    placeholder="pincode"
                    name="pincode"
                    withAsterisk
                  />
                </Grid.Col>
              </Grid>
              <Grid
                m={"md"}
                className={cx(classes.wrapper, {
                  [classes.addressWrapper]: true,
                })}
                columns={2}
              >
                <Grid.Col>
                  <Button type="submit" loading={isSubmitting}>
                    Save
                  </Button>
                </Grid.Col>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CompanyForm;
