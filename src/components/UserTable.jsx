import React, { useEffect, useState } from 'react';
import { Spinner } from './Spinner' // optional loading component

const users = [
  { name: 'Nguyễn Văn A', quota: 1000, used: 800, remaining: 200, usedPercent: 80, today: 25, error: 1, status: 'Gần hết' },
  { name: 'Trần Thị B', quota: 500, used: 450, remaining: 50, usedPercent: 90, today: 25, error: 5, status: 'Báo động' },
  { name: 'Phạm Văn C', quota: 500, used: 450, remaining: 50, usedPercent: 80, today: 25, error: 5, status: 'Báo' },
  { name: 'Lê Thị D', quota: 1610, used: 100, remaining: 300, usedPercent: 80, today: 30, error: 10, status: 'Báo động' }
]

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
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
      <h2 className="font-semibold mb-2">Thông tin người dùng</h2>
      <table className="w-full text-sm text-left">
        <thead className="border-b">
          <tr>
            <th>Tên nhân viên</th>
            <th>Tổng quota</th>
            <th>Đã dùng</th>
            <th>Còn lại</th>
            <th>% dùng</th>
            <th>Email check hôm nay</th>
            <th>Email ok hôm nay</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} className="border-b">
              <td>{u.sheetName}</td>
              <td>{u.quotaTotal}</td>
              <td>{u.quotaUsed}</td>
              <td>{u.quotaRemaining}</td>
              <td>{u.percentUsed}%</td>
              <td>{u.checkedToday}</td>
              <td>{u.okToday}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(u.status)}`}>
                  {u.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}