import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts'

const data = [
  { name: 'Đã dùng', value: 8000 },
  { name: 'Còn lại', value: 2000 },
]

const COLORS = ['#34d399', '#d1d5db']

export default function UsagePieChart() {
  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
      <h2 className="font-semibold mb-2">Tỉ lệ sử dụng hệ thống</h2>
      <PieChart width={300} height={200}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value">
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  )
}