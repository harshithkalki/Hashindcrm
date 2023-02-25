import {
  Header,
  Burger,
  useMantineTheme,
  MediaQuery,
  createStyles,
} from '@mantine/core';
import { useState } from 'react';
import { Footer } from '../Footer';
import NavbarNested from '../Navbar';

type Props = {
  hide?: boolean;
  shownav?: boolean;
  showheader?: boolean;
  showfooter?: boolean;
  children: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '0.8fr 1fr 1fr 1fr',

    gridTemplateAreas: `
      "header header header header"
      "nav main main main"
    `,
    gridTemplateRows: '50px 1fr',

    [theme.fn.smallerThan('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "header"
        "nav"
        "main"
      `,
    },
  },

  nav: {
    gridArea: 'nav',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    maxHeight: '100%',
  },

  main: {
    gridArea: 'main',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    gridRowStart: 2,
    gridRowEnd: 3,
  },

  header: {
    gridArea: 'header',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
  },
}));

export default function Layout({ shownav, showheader, children, hide }: Props) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <Header p='md' height={50} className={classes.header}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size='sm'
                color={theme.colors.gray[6]}
                mr='xl'
              />
            </MediaQuery>
          </div>
        </Header>
        <div className={classes.nav}>
          <NavbarNested hide={!opened} />
        </div>
        <main
          className={classes.main}
          style={{
            display: opened ? 'none' : 'block',
            padding: theme.spacing.xs,
            overflow: 'hidden',
            maxHeight: '100%',
            height: '100%',
          }}
        >
          {/* <ScrollArea style={{ height: '100%' }}>{children}</ScrollArea> */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
