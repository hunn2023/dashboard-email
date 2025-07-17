import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Spinner } from './Spinner' // optional loading component

ChartJS.register(ArcElement, Tooltip, Legend);

const SystemQuotaDoughnutChart = () => {

   const [data, setData] = useState(null);
  const [loading,setLoading] = useState(null);
  const [error,setError] = useState(null);


  useEffect(() => {
    async function fetchQuata() {
      try
      {
        const res = await fetch("https://apicheckmail.onrender.com/api/v1/emails/summary");
        if(!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false)
      }
    }
     fetchQuata();
  }, []);
  if (loading) {
    return (
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 flex justify-center items-center h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 text-red-500 text-center h-[300px]">
        Lỗi khi tải dữ liệu: {error || 'Không có dữ liệu'}
      </div>
    );
  }
 
   const { total, used, remaining } = data;

    const chartData = {
    labels: ['Đã dùng', 'Còn lại'],
    datasets: [
      {
        data: [used, remaining],
        backgroundColor: ['#10b981', '#d1d5db'],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
   
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">🧮 Tỉ lệ sử dụng key hệ thống</h2>
        <div className="w-full h-[250px]">
        <Doughnut data={chartData} options={options} />
        </div>
    </div>


  );
};

export default SystemQuotaDoughnutChart;
