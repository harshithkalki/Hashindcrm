import type { AppProps } from "next/app";
import Head from "next/head";
import {
  AppShell,
  Header,
  MantineProvider,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { Provider } from "react-redux";
import store from "../store";
import { trpc } from "../utils/trpc";
// import NavbarSimple from "../components/Navbar";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import NavbarNested from "../components/Navbar";

function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const matches = useMediaQuery("(max-width: 800px)");

  return (
    <>
      <Head>
        <title>HashindCrm</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
        }}
      >
        <AppShell
          padding="md"
          navbar={<NavbarNested hide={!opened} />}
          header={
            matches ? (
              <Header p="md" height={50}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </div>
              </Header>
            ) : undefined
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </AppShell>
      </MantineProvider>
    </>
  );
}

export default trpc.withTRPC(App);
