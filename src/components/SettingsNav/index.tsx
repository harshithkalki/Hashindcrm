import { Navbar, ScrollArea, createStyles, Button, Group } from '@mantine/core';
import {
  IconArrowNarrowLeft,
  IconDatabase,
  IconReceipt2,
  IconUser,
} from '@tabler/icons';
import type { NavData } from '../CollapsibleLink';
import LinksGroup from '../CollapsibleLink';
import { useState } from 'react';
import { useRouter } from 'next/router';

// import { UserMenu } from '../UserMenu';

const mockdata: NavData[] = [
  // { links: '/dashboard', label: 'DashBoard', icon: IconFileAnalytics },
  {
    links: '/settings/paymentmodes',
    label: 'Payment Modes',
    icon: IconReceipt2,
  },
  { links: '/settings/taxes', label: 'Taxes', icon: IconReceipt2 },
  { links: '/settings/units', label: 'Units', icon: IconReceipt2 },

  { links: '/settings/currencies', label: 'Currencies', icon: IconReceipt2 },
  { links: '/settings/profile', label: 'Profile', icon: IconUser },

  //   { links: "/logs", label: "Audit Logs", icon: IconFileAnalytics },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    maxHeight: '100%',
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    maxHeight: '100%',
  },

  linksInner: {
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
}));

interface Props {
  hide: boolean;
}

export default function SettingsNav({ hide }: Props) {
  const { classes } = useStyles();
  const [active, setActive] = useState('Billing');
  const router = useRouter();
  // const logout = trpc.staffRouter.logout.useMutation();

  const links = mockdata.map((item) => (
    <LinksGroup
      {...item}
      key={item.label}
      // onClick={() => {
      //   setActive(item.label);
      // }}
      active={item.label === active}
    />
  ));

  return (
    <Navbar
      p='md'
      className={classes.navbar}
      hiddenBreakpoint='sm'
      hidden={hide}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        {/* <Group className={classes.header} style={{ justifyContent: 'center' }}>
          <Title fw={400} fz={'lg'}>
            Settings
          </Title>
        </Group> */}
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Group style={{ justifyContent: 'center' }}>
          <Button
            leftIcon={<IconArrowNarrowLeft />}
            variant='outline'
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            Go back to Home
          </Button>
        </Group>
      </Navbar.Section>
      {/* <Navbar sectio className={classes.footer}>
       
      </Navbar> */}
    </Navbar>
  );
}
