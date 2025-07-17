import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Spinner } from './Spinner' // optional loading component
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TodayKeyStatusChart = () => {
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(null);
  const [error,setError] = useState(null);
  useEffect(() => {
    async function fetchQuata() {
      try
      {
        const res = await fetch("https://apicheckmail.onrender.com/api/v1/emails/log/usage-detail");
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

  if (!data || !Array.isArray(data)) return <div>Không có dữ liệu.</div>;
  const labels = data.map(item => item.email);
  const okValues = data.map(item => item.totalOk);
  const totalValues = data.map(item => item.totalChecked);
  

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Email check OK',
        data: okValues,
        backgroundColor: '#077a54ff',
        borderRadius: 8,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
      {
        label: 'Tổng email check',
        data: totalValues,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#374151',
          font: {
            size: 14,
            weight: '100',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#374151',
          font: {
            size: 14,
            weight: '100',
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
       <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">🧮 Dữ liệu check ngày nay</h2>
              <div className="w-full h-[250px]">
                <Bar data={chartData} options={options} />
              </div>
          </div>
  );
};

export default TodayKeyStatusChart;
