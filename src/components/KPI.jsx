import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

export default function KPI() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(
          "https://apicheckmail.onrender.com/api/v1/emails/stats/all-days"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const calculateKPI = (records) => {
    return records.map((record) => {
      const efficiency =
        record.creditsUsed > 0
          ? record.companyChecked / record.creditsUsed
          : 0;
      const accuracy =
        record.creditsUsed > 0 ? record.emailsOk / record.creditsUsed : 0;
      return { ...record, efficiency, accuracy };
    });
  };

  const getLeaderboard = () => {
    let leaderboard = [];
    data.forEach(({ records }) => {
      const kpiData = calculateKPI(records);
      leaderboard = [...leaderboard, ...kpiData];
    });

    // Tổng hợp theo nhân viên
    const grouped = {};
    leaderboard.forEach((item) => {
      if (!grouped[item.name]) {
        grouped[item.name] = {
          name: item.name,
          companyChecked: 0,
          emailsOk: 0,
          creditsUsed: 0,
        };
      }
      grouped[item.name].companyChecked += item.companyChecked;
      grouped[item.name].emailsOk += item.emailsOk;
      grouped[item.name].creditsUsed += item.creditsUsed;
    });

    // Tính lại KPI
    const finalLeaderboard = Object.values(grouped).map((item) => {
      const efficiency =
        item.creditsUsed > 0 ? item.companyChecked / item.creditsUsed : 0;
      const accuracy =
        item.creditsUsed > 0 ? item.emailsOk / item.creditsUsed : 0;
      return { ...item, efficiency, accuracy };
    });

    // Sắp xếp và đánh thứ hạng
    return finalLeaderboard
      .sort((a, b) => b.efficiency - a.efficiency)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  };

  const leaderboard = getLeaderboard();

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "👤";
    }
  };

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
        Lỗi khi tải dữ liệu: {error || "Không có dữ liệu"}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-4">🏆 Bảng xếp hạng hiệu suất nhân viên</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="px-4 py-2">Hạng</th>
              <th className="px-4 py-2">Nhân viên</th>
              <th className="px-4 py-2">Công ty</th>
              <th className="px-4 py-2">Email OK</th>
              <th className="px-4 py-2">Email Check</th>
              <th className="px-4 py-2">Hiệu suất</th>
              <th className="px-4 py-2">Tỉ lệ chính xác</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user) => (
              <tr key={user.name} className="text-center border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-bold text-xl">{getRankIcon(user.rank)}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-2">{user.companyChecked}</td>
                <td className="px-4 py-2">{user.emailsOk}</td>
                <td className="px-4 py-2">{user.creditsUsed}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">
                  {(user.efficiency * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2 text-blue-600 font-semibold">
                  {(user.accuracy * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
