import type { SelectProps } from '@mantine/core';
import { Select, Text } from '@mantine/core';
import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text>{label}</Text>
    </div>
  )
);

export default function InfiniteSelect(
  props: Omit<SelectProps, 'itemComponent'>
) {
  return <Select itemComponent={SelectItem} {...props} />;
}
