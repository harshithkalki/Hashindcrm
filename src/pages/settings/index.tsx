import Layout from '@/components/Layout';
import React from 'react';
import SettingsNav from '@/components/SettingsNav';

const index = () => {
  return (
    <Layout navBar={<SettingsNav hide={false} />}>
      <div>index</div>
    </Layout>
  );
};

export default index;
