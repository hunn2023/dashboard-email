
import React, { useEffect, useState } from 'react';
import { Spinner } from './Spinner' 


export default function EmployeeUsageChart() {

  const [data,setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://apicheckmail.onrender.com/api/v1/emails/stats/all-days');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
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
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-200">
      <h2 className="text-base font-semibold text-gray-700 mb-3 text-center"> Tổng hợp dữ liệu tháng hiện tại</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Nhân viên</th>
              <th className="px-4 py-3">Công ty đã check</th>
              <th className="px-4 py-3">Email OK</th>
              <th className="px-4 py-3">Email đã check</th>
            </tr>
          </thead>
       <tbody>
  {data.map(({ date, records }, index) => {
    const totalCompanyChecked = records.reduce((sum, r) => sum + r.companyChecked, 0);
    const totalEmailsOk = records.reduce((sum, r) => sum + r.emailsOk, 0);
    const totalCreditsUsed = records.reduce((sum, r) => sum + r.creditsUsed, 0);

    return records.map((record, idx) => (
      <tr
        key={`${date}-${record.name}`}
        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
      >
        <td className="px-4 py-3 font-semibold text-gray-800 text-center align-top">
          {idx === 0 ? (
            <div>
              <div>{date}</div>
              <div className="mt-1 text-xs text-gray-500">
                Total:{" "}
                <span className="text-blue-600 font-semibold">
                  {totalCompanyChecked} COMPANY
                </span>
                ,{" "}
                <span className="text-green-600 font-semibold">
                  {totalEmailsOk} OK
                </span>
                ,{" "}
                <span className="text-rose-600 font-semibold">
                  {totalCreditsUsed} CHECK
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </td>
        <td className="px-4 py-3 text-center font-medium text-gray-800">{record.name}</td>
        <td className="px-4 py-3 text-center">{record.companyChecked}</td>
        <td className="px-4 py-3 text-center">{record.emailsOk}</td>
        <td className="px-4 py-3 text-center">{record.creditsUsed}</td>
      </tr>
    ));
  })}
</tbody>

        </table>
      </div>
    </div>
  );
}
