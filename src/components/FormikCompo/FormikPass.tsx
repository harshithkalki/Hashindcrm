import type { PasswordInputProps } from "@mantine/core";
import { PasswordInput } from "@mantine/core";
import { useField } from "formik";

interface Props extends PasswordInputProps {
  name: string;

  label?: string;
}

const FormInput: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <PasswordInput
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
    />
  );
};

export default FormInput;
