import Layout from '@/components/Layout';
import SettingsNav from '@/components/SettingsNav';
import React from 'react';

const index = () => {
  return <Layout navBar={<SettingsNav hide={false} />}>currencies</Layout>;
};

export default index;
