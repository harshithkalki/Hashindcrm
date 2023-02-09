import { DatePicker } from '@mantine/dates';
import type { DatePickerProps } from '@mantine/dates/lib/components/DatePicker';
import { useField } from 'formik';

interface Props extends DatePickerProps {
  name: string;

  label?: string;
}

const FormDate: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta, helper] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <DatePicker
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
      onChange={(e) => {
        const date = e?.toISOString();
        helper.setValue(date, true);
      }}
    />
  );
};

export default FormDate;
