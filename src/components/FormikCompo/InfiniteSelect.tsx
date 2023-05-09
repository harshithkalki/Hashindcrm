import { useField } from 'formik';
import type { InfiniteSelectProps } from '../Custom/InfiniteSelect';
import InfiniteSelect from '../Custom/InfiniteSelect';

interface Props extends InfiniteSelectProps {
  name: string;
  label?: string;
}

const FormikInfiniteSelect: React.FC<Props> = ({ name, label, ...props }) => {
  const [field, meta, helper] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <InfiniteSelect
      label={label}
      error={isError ? meta.error : undefined}
      {...field}
      {...props}
      onChange={(e) => {
        helper.setValue(e, true);
        props.onChange && props.onChange(e);
      }}
    />
  );
};

export default FormikInfiniteSelect;
