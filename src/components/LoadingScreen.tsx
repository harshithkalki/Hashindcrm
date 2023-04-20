import Layout from '@/components/Layout';
import { Center, Loader } from '@mantine/core';

export const LoadingScreen = () => {
  return (
    <Layout>
      <Center h='100%'>
        <Loader />
      </Center>
    </Layout>
  );
};
