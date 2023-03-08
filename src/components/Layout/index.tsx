import { useMantineTheme, createStyles } from '@mantine/core';
import { useState } from 'react';
import { Footer } from '../Footer';
import { CustomHeader } from '../Header';
import NavbarNested from '../Navbar';

type Props = {
  hide?: boolean;
  shownav?: boolean;
  showheader?: boolean;
  showfooter?: boolean;
  navBar?: React.ReactNode;
  children: React.ReactNode;
};

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '0.8fr 1fr 1fr 1fr',

    gridTemplateAreas: `
      "nav main main main"
    `,
    gridTemplateRows: '1fr',

    [theme.fn.smallerThan('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
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
    gridRowStart: 1,
    gridRowEnd: 2,
  },

  header: {
    gridArea: 'header',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    height: '100%',
  },
}));

export default function Layout({
  shownav,
  showheader,
  children,
  hide,
  navBar,
}: Props) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <div>
      <CustomHeader user={{ name: 'abhriam', image: '' }} />
      <div className={classes.container}>
        <div className={classes.nav}>
          {navBar ?? <NavbarNested hide={!opened} />}
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
