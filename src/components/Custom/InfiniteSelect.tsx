import type { SelectItem, SelectProps } from '@mantine/core';
import { Select, Text } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { Waypoint } from 'react-waypoint';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  index: number;
}

interface InfiniteSelectProps
  extends Omit<SelectProps, 'itemComponent' | 'data'> {
  onWaypointEnter: () => void;
  data: (string | (SelectItem & { index: number }))[];
}

export default function InfiniteSelect({
  onWaypointEnter,
  ...props
}: InfiniteSelectProps) {
  const SelectItem = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      forwardRef<HTMLDivElement, ItemProps>(
        ({ label, index, ...others }: ItemProps, ref) => (
          <div ref={ref} {...others}>
            <Text>{label}</Text>
            {index === props.data.length - 5 && (
              <Waypoint onEnter={onWaypointEnter} />
            )}
          </div>
        )
      ),
    [props.data.length, onWaypointEnter]
  );

  return <Select itemComponent={SelectItem} {...props} />;
}
