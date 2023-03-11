import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  Text,
  UnstyledButton,
  createStyles,
  ThemeIcon,
} from '@mantine/core';
import type { TablerIcon } from '@tabler/icons';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { useRouter } from 'next/router';
import type { Permissions } from '@/constants';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    control: {
      fontWeight: 500,
      display: 'block',
      width: '100%',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      fontSize: theme.fontSizes.sm,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

    link: {
      fontWeight: 500,
      display: 'block',
      textDecoration: 'none',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
      paddingLeft: 31,
      marginLeft: 30,
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      borderLeft: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },

    chevron: {
      transition: 'transform 200ms ease',
    },
    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.white,
      opacity: 0.75,
      marginRight: theme.spacing.sm,
    },
  };
});

export interface NavData {
  links:
    | string
    | {
        label: string;
        link: string;
        permissionName?: typeof Permissions[number];
      }[];
  label: string;
  permissionName?: typeof Permissions[number];
  icon: TablerIcon;
}

export interface LinksGroupProps extends NavData {
  initiallyOpened?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export default function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  active,
  onClick,
}: LinksGroupProps) {
  console.log(active);
  const { classes, theme, cx } = useStyles();
  const [isActive, setActive] = useState<number>();
  const { push, pathname } = useRouter();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  const items = (hasLinks ? links : []).map((link, index) => (
    <Text<'a'>
      component='a'
      className={cx(classes.link, {
        [classes.linkActive]: pathname === link.link && active,
      })}
      key={link.label}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) {
          onClick();
        }
        setActive(index);
        push(link.link);
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o);

          if (!hasLinks) {
            push(links);
            if (onClick) {
              onClick();
            }
          }
        }}
        className={cx(classes.control, {
          [classes.linkActive]: active && !hasLinks,
        })}
        // style={{ cursor: "pointer" }}
      >
        <Group position='apart' spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml='md'>{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
