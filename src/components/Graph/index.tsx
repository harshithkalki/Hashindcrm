import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type data = {
  name: string;
  purchase: string;
  sale: string;
}[];

const Index = ({ data }: { data: data }) => {
  const { t } = useTranslation('common');
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='purchase' fill='#8884d8' />
        <Bar dataKey='sale' fill='#82ca9d' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Index;
