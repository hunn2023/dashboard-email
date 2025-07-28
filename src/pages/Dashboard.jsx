import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard'
import UserTable from '../components/UserTable'
import AlertsPanel from '../components/AlertsPanel'
import SystemQuotaDoughnutChart from "../components/SystemQuotaDoughnutChart";
import TodayKeyStatusChart from "../components/TodayKeyStatusChart";
import KeyUsageTrendChart from "../components/KeyUsageTrendChart";
import EmployeeUsageChart from "../components/EmployeeUsageChart";
import KPI from "../components/KPI";
import {Spinner}  from '../components/Spinner' ;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('https://apicheckmail.onrender.com/api/v1/emails/summary');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setSummary(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

    if (loading) {
        return (
          <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 flex justify-center items-center h-[300px]">
            <Spinner />
          </div>
        );
      }
    if (error || !summary) {
        return (
          <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 text-red-500 text-center h-[300px]">
            Lỗi khi tải dữ liệu: {error || 'Không có dữ liệu'}
          </div>
        );
      }


  return (
    <div className="p-6 space-y-6">
       <h2 className="text-base font-semibold text-gray-700 mb-3 text-center"> Tổng hợp dữ liệu tháng hiện tại</h2>

      <div className="grid grid-cols-4 gap-4">
       <SummaryCard title="TỔNG SỐ KEY" value={summary.total.toLocaleString()} icon="🗝️" />
        <SummaryCard title="KEY ĐÃ DÙNG" value={summary.used.toLocaleString()} icon="⚠️" />
        <SummaryCard title="Key CÒN LẠI" value={summary.remaining.toLocaleString()} icon="✅" />
        <AlertsPanel />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SystemQuotaDoughnutChart />
        <TodayKeyStatusChart />
      </div>
      <UserTable />
      <EmployeeUsageChart />
      <KeyUsageTrendChart />
      <KPI />
 
    </div>
  )
}