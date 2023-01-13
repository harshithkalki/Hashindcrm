import type { SwitchProps } from "@mantine/core";
import { Switch } from "@mantine/core";
import { useField } from "formik";

interface Props extends SwitchProps {
  name: string;
  label?: string;
}

const FormikSwitch: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <Switch
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
    />
  );
};

export default FormikSwitch;
