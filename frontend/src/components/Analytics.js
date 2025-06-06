import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const categoryColors = {
  Rental: '#8884d8',
  Groceries: '#82ca9d',
  Entertainment: '#ffc658',
  Travel: '#ff8042',
  Others: '#8dd1e1'
};

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/expenses/analytics').then((res) => {
      const grouped = {};
      res.data.forEach((item) => {
        const key = `${item._id.year}-${item._id.month}`;
        if (!grouped[key]) grouped[key] = { month: key };
        grouped[key][item._id.category] = item.total;
      });
      setData(Object.values(grouped));
    });
  }, []);

  return (
    <div>
      <h4>Analytics</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(categoryColors).map((cat) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={categoryColors[cat]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Analytics;