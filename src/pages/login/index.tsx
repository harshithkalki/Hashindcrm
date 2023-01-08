import FormInput from "@/components/FormikCompo/FormikInput";
import FormikPass from "@/components/FormikCompo/FormikPass";
import { trpc } from "@/utils/trpc";
import {
  Paper,
  createStyles,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import { Formik, Form } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface Login {
  email: string;
  password: string;
}
const onSubmit = async (values: Login, actions: any) => {
  console.log(values);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  actions.resetForm();
};

const formInputs: Login = {
  email: "",
  password: "",
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function AuthenticationImage() {
  const { classes } = useStyles();
  const loginUser = trpc.userRouter.login.useMutation();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome!
        </Title>

        <Formik
          initialValues={formInputs}
          validationSchema={toFormikValidationSchema(
            z.object({
              email: z.string().email({ message: "Please enter valid email" }),
              password: z.string(),
            })
          )}
          onSubmit={(value) => {
            return loginUser.mutateAsync(value).then(() => {
              console.log("success");
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                label="Email"
                placeholder="Enter your email"
                name="email"
                withAsterisk
                mb={"sm"}
              />
              <FormikPass
                label="Password"
                placeholder="Password"
                name="password"
                withAsterisk
                mb={"sm"}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                // onClick={() => {
                //   console.log(values);
                // }}
                mt={"md"}
              >
                login
              </Button>
            </Form>
          )}
        </Formik>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => event.preventDefault()}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
