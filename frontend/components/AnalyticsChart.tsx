import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsChart = () => {
  // Mock data for conversion rates
  const data = [
    { name: 'Jan', conversion: 45 },
    { name: 'Feb', conversion: 52 },
    { name: 'Mar', conversion: 48 },
    { name: 'Apr', conversion: 61 },
    { name: 'May', conversion: 55 },
    { name: 'Jun', conversion: 67 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rate Analytics</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="conversion" fill="#4f46e5" name="Conversion Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Conversion rate represents the percentage of requirements that resulted in successful trainer bookings.
      </p>
    </div>
  );
};

export default AnalyticsChart;