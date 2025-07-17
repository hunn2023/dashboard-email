import React from 'react';

export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 shadow-xl border border-gray-200 rounded-2xl p-5">
      <div className="text-gray-500 text-sm font-semibold">{title}</div>
      <div className="text-2xl font-bold mt-1 flex items-center gap-2">
        {icon} {value}
      </div>
    </div>
  );
}