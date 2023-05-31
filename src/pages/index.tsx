import { type NextPage } from 'next';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';

const Home: NextPage = () => {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <h1>{t('title')}</h1>
    </Layout>
  );
};

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  console.log('locale', locale);
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default Home;
