import {
  SimpleGrid,
  Title,
  Avatar,
  createStyles,
  LoadingOverlay,
  Loader,
  Grid,
  MultiSelect,
  Button,
} from "@mantine/core";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@/components/FormikCompo/FormikInput";
import { z } from "zod";
// import Formiktextarea from "@/components/FormikCompo/FormikTextarea";
import FormikSelect from "@/components/FormikCompo/FormikSelect";

const rolesOptions = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Guest", value: "guest" },
];

const companyOptions = [
  { label: "Company 1", value: "company1" },
  { label: "Company 2", value: "company2" },
  { label: "Company 3", value: "company3" },
];

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

export interface UserFormType {
  firstname: string;
  lastname: string;
  middlename: string;
  phone: string;
  email: string;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  role: string;
  linkedto?: string;
}

const onSubmit = async (values: UserFormType, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

interface Props {
  title: string;
  //   onSubmit: (inputs: UserFormType) => Promise<void>;
  formInputs: UserFormType;
}

const UserForm = ({ title, formInputs }: Props) => {
  //   const createUser = trpc.user.createUser.useMutation();
  const { classes, cx } = useStyles();

  return (
    <div>
      <Title order={2}>{title}</Title>
      <Formik
        initialValues={formInputs}
        validationSchema={toFormikValidationSchema(
          z.object({
            firstname: z.string(),
            middlename: z.string().optional(),
            lastname: z.string(),
            email: z.string().email({ message: "Please enter valid" }),
            phone: z
              .string()
              .length(10, "Phone number should be only 10 digits"),
            addressline1: z.string(),
            addressline2: z.string(),
            city: z.string(),
            state: z.string(),
            country: z.string(),
            pincode: z.string(),
            role: z.string(),
            linkedTo: z.string().optional(),
          })
        )}
        // onSubmit={(values, { setSubmitting }) => {
        //   onSubmit(values).then(() => setSubmitting(false));
        // }}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => {
          return (
            <Form>
              <SimpleGrid
                m={"md"}
                cols={3}
                className={classes.wrapper}
                breakpoints={[
                  { maxWidth: "md", cols: 3, spacing: "md" },
                  { maxWidth: "sm", cols: 2, spacing: "sm" },
                  { maxWidth: "xs", cols: 1, spacing: "sm" },
                ]}
              >
                <FormInput
                  label="First name"
                  placeholder="First name"
                  name="firstname"
                  withAsterisk
                />
                <FormInput
                  label="middle name"
                  placeholder="middle name"
                  name="middlename"
                />
                <FormInput
                  label="Last name"
                  placeholder="Last name"
                  name="lastname"
                  withAsterisk
                />
                <FormInput
                  label="Phone number"
                  placeholder="Ex: 1234567890"
                  name="phone"
                  withAsterisk
                />
                <FormInput
                  label="Email"
                  placeholder="Ex: name@gmail.com"
                  name="email"
                  withAsterisk
                />
              </SimpleGrid>
              <Grid
                m={"md"}
                className={cx(classes.wrapper, {
                  [classes.addressWrapper]: true,
                })}
                columns={4}
              >
                <Grid.Col>
                  <Title order={4}>Roles & companies</Title>
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormikSelect
                    label="Select a Role"
                    data={rolesOptions}
                    placeholder="Pick one role"
                    name="role"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={1} sm={4}>
                  <FormikSelect
                    label="Linked to"
                    data={rolesOptions}
                    placeholder="Pick one role"
                    name="linkedto"
                  />
                </Grid.Col>
              </Grid>
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
                    name="addressline1"
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col lg={2} sm={4}>
                  <FormInput
                    label="Address line 2"
                    placeholder="Address line 2"
                    name="addressline2"
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

export default UserForm;
