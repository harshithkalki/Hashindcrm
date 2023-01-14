import { forwardRef } from "react";
import { Group, Select, Badge, ActionIcon } from "@mantine/core";
import { IconHash } from "@tabler/icons";

const data = [
  {
    image: "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
    label: "Bender Bending Rodríguez",
    value: "Bender Bending Rodríguez",
    description: "Fascinated with cooking",
  },

  {
    image: "https://img.icons8.com/clouds/256/000000/futurama-mom.png",
    label: "Carol Miller",
    value: "Carol Miller",
    description: "One of the richest people on Earth",
  },
  {
    image: "https://img.icons8.com/clouds/256/000000/homer-simpson.png",
    label: "Homer Simpson",
    value: "Homer Simpson",
    description: "Overweight, lazy, and often ignorant",
  },
  {
    image: "https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png",
    label: "Spongebob Squarepants",
    value: "Spongebob Squarepants",
    description: "Not just a sponge",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}
const hashButton = (
  <ActionIcon size="xs" color="blue" radius="xl" variant="transparent">
    <IconHash size={14} />
  </ActionIcon>
);

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => {
    SelectItem.displayName = "SelectItem";
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Badge variant="filled" fullWidth leftSection={hashButton}>
              {label}
            </Badge>
          </div>
        </Group>
      </div>
    );
  }
);

function TicketSelect() {
  return (
    <Select
      placeholder="Pick one"
      itemComponent={SelectItem}
      data={data}
      searchable
      maxDropdownHeight={400}
      nothingFound="Nobody here"
      icon={<IconHash size={14} />}
      styles={(theme) => ({
        item: {
          // applies styles to selected item
          "&[data-selected]": {
            "&, &:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[8]
                  : theme.colors.gray[1],
              color:
                theme.colorScheme === "dark"
                  ? theme.white
                  : theme.colors.teal[9],
            },
          },

          // applies styles to hovered item (with mouse or keyboard)
          "&[data-hovered]": {},
        },
      })}
    />
  );
}
export default TicketSelect;
