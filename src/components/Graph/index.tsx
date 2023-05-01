import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type data = {
  name: string;
  purchase: number;
  sale: number;
}[];

const index = ({ data }: { data: data }) => {
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
        {/* <CartesianGrid /> */}
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

export default index;
