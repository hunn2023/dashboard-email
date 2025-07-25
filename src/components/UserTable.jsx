import React, { useEffect, useState } from 'react';
import { Spinner } from './Spinner' // optional loading component

const getStatusColor = (status) => {
  switch (status) {
    case 'Gần hết': return 'bg-yellow-100 text-yellow-800'
    case 'Báo động': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://apicheckmail.onrender.com/api/v1/emails/stats/staff');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUsers(data);
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

  if (error || !users) {
    return (
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 text-red-500 text-center h-[300px]">
        Lỗi khi tải dữ liệu: {error || 'Không có dữ liệu'}
      </div>
    );
  }
 

  return (
     <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-200">
     <h2 className="text-base font-semibold text-gray-900 mb-3 text-center"> Dữ liệu check ngày nay</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-4 py-3">Nhân viên</th>
              <th className="px-4 py-3">Tổng  credit</th>
              <th className="px-4 py-3">Credit đã dùng</th>
              <th className="px-4 py-3">Credit còn lại</th>
                 <th className="px-4 py-3">% dùng</th>
                    <th className="px-4 py-3">Tổng số công ty đã check</th>
                       <th className="px-4 py-3">Tổng số email đã check</th>
                          <th className="px-4 py-3">Tổng số email ok</th>
                             <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
         <tbody>
          {users.map((u, idx) => (
            <tr key={idx} 
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 text-center font-medium text-gray-800">{u.sheetName}</td>
              <td className="px-4 py-3 text-center">{u.quotaTotal}</td>
              <td className="px-4 py-3 text-center">{u.quotaUsed}</td>
              <td className="px-4 py-3 text-center">{u.quotaRemaining}</td>
              <td className="px-4 py-3 text-center">{u.percentUsed}</td>
              <td className="px-4 py-3 text-center">{u.totalDomain}</td>
              <td className="px-4 py-3 text-center">{u.checkedToday}</td>
              <td className="px-4 py-3 text-center">{u.okToday}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(u.status)}`}>
                  {u.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
          {/* <tbody>
            {data.map(({ date, records }, index) =>
              records.map((record, idx) => (
                <tr
                  key={`${date}-${record.name}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 font-semibold text-gray-800 text-center align-top">
                    {idx === 0 ? date : ""}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">{record.name}</td>
                  <td className="px-4 py-3 text-center">{record.companyChecked}</td>
                  <td className="px-4 py-3 text-center">{record.emailsOk}</td>
                  <td className="px-4 py-3 text-center">{record.creditsUsed}</td>
                </tr>
              ))
            )}
          </tbody> */}
        </table>
      </div>
    </div>

    // <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
    //   <h2 className="font-semibold mb-2"> Tổng hợp dữ liệu check ngày nay</h2>
    //   <table className="w-full text-sm text-left">
    //     <thead className="border-b">
    //       <tr>
    //         <th>Tên nhân viên</th>
    //         <th>Tổng quota</th>
    //         <th>Đã dùng</th>
    //         <th>Còn lại</th>
    //         <th>% dùng</th>
    //         <th>Tổng số công ty đã check</th>
    //         <th>Tổng số email đã check</th>
    //         <th>Tổng số email ok</th>
    //         <th>Trạng thái</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {users.map((u, idx) => (
    //         <tr key={idx} className="border-b">
    //           <td>{u.sheetName}</td>
    //           <td>{u.quotaTotal}</td>
    //           <td>{u.quotaUsed}</td>
    //           <td>{u.quotaRemaining}</td>
    //           <td>{u.percentUsed}%</td>
    //           <td>{u.totalDomain}</td>
    //           <td>{u.checkedToday}</td>
    //           <td>{u.okToday}</td>
    //           <td>
    //             <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(u.status)}`}>
    //               {u.status}
    //             </span>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
}