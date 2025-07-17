import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Thị J', used: 1000, errors: 200 },
  { name: 'Trần B', used: 900, errors: 100 },
  { name: 'Thị B', used: 950, errors: 150 },
  { name: 'Phạm V', used: 850, errors: 100 },
  { name: 'Lê D', used: 800, errors: 50 }
]

export default function DailyTrendChart() {
  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
      <h2 className="font-semibold mb-2">Xu hướng theo ngày</h2>
      <BarChart width={400} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="used" fill="#f87171" name="Đã dùng" />
        <Bar dataKey="errors" fill="#60a5fa" name="Lỗi" />
      </BarChart>
    </div>
  )
}