import React, { useEffect, useState } from 'react';
export default function AlertsPanel() {
    const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('https://apicheckmail.onrender.com/api/v1/emails/stats/staff');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const users = await res.json();

        // ⚠️ Lọc người cần cảnh báo
        const warningList = users.filter(u => u.quotaRemaining <= 0 || u.checkedToday === 0);

        // ✅ Tạo thông báo tương ứng
        const messages = warningList.map(u => {
          if (u.quotaRemaining <= 0) {
            return `${u.sheetName}: Đã hết quota - cần cấp thêm`;
          }
          if (u.checkedToday === 0) {
            return `${u.sheetName}: chưa check email hôm nay`;
          }
          return null;
        }).filter(Boolean);

        setAlerts(messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  if (loading) return null;
  if (error || alerts.length === 0) return null;
  return (
       <div className="bg-red-100 shadow-xl border border-red-200 rounded-2xl p-5 text-red-800 text-sm font-semibold">
      {alerts.map((msg, idx) => (
        <p key={idx}>{msg}</p>
      ))}
    </div>

  );
}