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

      // ✅ Tạo thông báo cảnh báo tương ứng
      const messages = users.flatMap(u => {
        const alerts = [];

        // 1. Hết quota
        if (u.quotaRemaining <= 0) {
          alerts.push(`${u.sheetName}: 🔴 Đã hết quota - cần cấp thêm`);
        }

        // 2. Chưa check hôm nay
        if (u.checkedToday === 0) {
          alerts.push(`${u.sheetName}: ⚠️ Chưa check email hôm nay`);
        }

        // 3. Theo dõi phần trăm quota dùng
        const percent = parseFloat(u.percentUsed.replace('%', '')) || 0;
        if (percent >= 95) {
          alerts.push(`${u.sheetName}: 🔴 Đã dùng ${u.percentUsed} - sắp hết quota`);
        } else if (percent >= 80) {
          alerts.push(`${u.sheetName}: 🟡 Đã dùng ${u.percentUsed} - nên theo dõi`);
        }

        return alerts;
      });

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