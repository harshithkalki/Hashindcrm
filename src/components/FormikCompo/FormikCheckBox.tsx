import type { CheckboxProps } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useField } from "formik";

interface Props extends CheckboxProps {
  name: string;
  label?: string;
}

const FormikCheck: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <Checkbox
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
    />
  );
};

export default FormikCheck;
