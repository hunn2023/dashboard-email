import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Spinner } from './Spinner' // optional loading component

export default function KeyUsageTrendChart() {
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(null);
  const [error,setError] = useState(null);


  useEffect(() => {
    async function fetchQuata() {
      try
      {
        const res = await fetch("https://apicheckmail.onrender.com/api/v1/emails/log/key-usage-optimized");
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
  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 w-full">
      <h2 className="font-semibold mb-2">Lịch sử sử dụng key theo thời gian</h2>
      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="daily" name="Theo ngày" stroke="#34d399" />
        <Line type="monotone" dataKey="weekly" name="Theo tuần" stroke="#60a5fa" />
        <Line type="monotone" dataKey="monthly" name="Theo tháng" stroke="#fbbf24" />
      </LineChart>
    </div>
  )
}