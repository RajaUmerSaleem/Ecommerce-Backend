import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueDoughnutChart = ({ data }) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  const chartData = {
    labels: ['Revenue', 'Profit'],
    datasets: [
      {
        data: [totalRevenue, totalProfit],
        backgroundColor: ['rgba(255, 182, 193, 0.8)', 'rgba(135, 206, 250, 0.8)'],
        borderColor: ['rgba(255, 182, 193, 1)', 'rgba(135, 206, 250, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue vs Profit',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default RevenueDoughnutChart;