import type { TextareaProps } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { useField } from "formik";

interface Props extends TextareaProps {
  name: string;

  label?: string;
}

const Formiktextarea: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <Textarea
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
    />
  );
};

export default Formiktextarea;
