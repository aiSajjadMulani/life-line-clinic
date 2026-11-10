import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  Users,
  CalendarCheck,
  HandCoins,
  Wallet,
  Receipt,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Stethoscope,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ClinicData, ActivePage } from '../types/clinic';

Chart.register(...registerables);

interface DashboardProps {
  data: ClinicData;
  onNavigate: (page: ActivePage) => void;
  onOpenNewPatient: () => void;
  onOpenNewVisit: (patientId?: string) => void;
  onOpenNewRx: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  onNavigate,
  onOpenNewPatient,
  onOpenNewVisit,
  onOpenNewRx,
  onSelectPatient
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const sym = data.settings.currency || '$';
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = todayStr.substring(0, 7);

  // Metrics
  const totalPatients = data.patients.length;
  const todayVisits = data.visits.filter((v) => v.date === todayStr);

  const todayCollection = data.collections
    .filter((c) => c.date === todayStr && c.status === 'Paid')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const monthlyCollection = data.collections
    .filter((c) => c.date && c.date.startsWith(currentMonth) && c.status === 'Paid')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const todayExpenses = data.expenses
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const monthlyExpenses = data.expenses
    .filter((e) => e.date && e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const netMonthlyIncome = monthlyCollection - monthlyExpenses;

  // Chart setup
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().substring(0, 7);
      labels.push(d.toLocaleString('en-US', { month: 'short' }));

      const mInc = data.collections
        .filter((c) => c.date && c.date.startsWith(key) && c.status === 'Paid')
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

      const mExp = data.expenses
        .filter((e) => e.date && e.date.startsWith(key))
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

      incomeData.push(mInc);
      expenseData.push(mExp);
    }

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Collections',
            data: incomeData,
            backgroundColor: '#059669',
            borderRadius: 6,
            barPercentage: 0.6
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: '#e11d48',
            borderRadius: 6,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${sym}${Number(ctx.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (val) => `${sym}${val}`
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 12 } },
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data.collections, data.expenses, sym]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time clinical throughput, patient consultation flow, and practice financial summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewVisit()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <Stethoscope className="w-4 h-4 text-sky-600" />
            <span>Log Visit</span>
          </button>
          <button
            onClick={onOpenNewRx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Rx</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Patients
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {totalPatients}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Active electronic health records</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Consultations
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {todayVisits.length}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Attended today</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Collection
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {sym}{todayCollection.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Daily inflow received</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <HandCoins className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Collections
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {sym}{monthlyCollection.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Current month gross billing</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Financial KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Expenses
            </span>
            <h3 className="text-xl font-extrabold text-rose-600 mt-1 font-mono">
              {sym}{todayExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Itemized clinic costs today</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Expenses
            </span>
            <h3 className="text-xl font-extrabold text-rose-600 mt-1 font-mono">
              {sym}{monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Supplies, utilities & salaries</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Net Monthly Income Highlight */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
              Net Practice Income (Monthly)
            </span>
            <h3 className="text-2xl font-extrabold mt-1 font-mono text-emerald-400">
              {sym}{netMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-300 mt-1">Collections − Practice Expenses</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 border border-white/20">
            <CircleDollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts & Today's Consultations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Comparative Trend Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Expense Trajectory</h3>
              <p className="text-xs text-slate-500">6-Month historical performance</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 relative">
            <canvas ref={chartCanvasRef} />
          </div>
        </div>

        {/* Today's Consultations Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Consultations</h3>
              <p className="text-xs text-slate-500">{todayVisits.length} recorded</p>
            </div>
            <button
              onClick={() => onNavigate('visits')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 -mx-2 px-2">
            {todayVisits.length > 0 ? (
              todayVisits.map((v) => (
                <div key={v.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="min-w-0">
                    <button
                      onClick={() => onSelectPatient(v.patientId)}
                      className="text-xs font-bold text-slate-900 hover:text-sky-600 text-left block truncate"
                    >
                      {v.patientName}
                    </button>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {v.diagnosis || v.complaint}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-600">
                      {v.bp && (
                        <span className="bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-100">
                          {v.bp}
                        </span>
                      )}
                      {v.weight && <span>{v.weight}kg</span>}
                      {v.temp && <span>{v.temp}°F</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPatient(v.patientId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors shrink-0"
                    title="View Patient Chart"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Stethoscope className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 font-medium">No consultations logged today yet.</p>
                <button
                  onClick={() => onOpenNewVisit()}
                  className="mt-3 text-xs font-semibold text-sky-600 hover:underline"
                >
                  + Log First Consultation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Split: Recent Patients & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Registered Patients */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recently Registered Patients</h3>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Age/Sex</th>
                  <th className="pb-2">Contact</th>
                  <th className="pb-2">Complaint</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.patients.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-semibold text-slate-900">
                      {p.name}
                      <span className="block text-[10px] font-mono text-slate-400">{p.id}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">{p.age}y / {p.gender}</td>
                    <td className="py-2.5 text-slate-600 font-mono">{p.mobile}</td>
                    <td className="py-2.5 text-slate-500 max-w-[140px] truncate">{p.complaint}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onSelectPatient(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Clinic Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Operational Expenses</h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Item / Description</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.expenses.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-mono text-slate-500">{e.date}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-800 font-medium max-w-[160px] truncate">
                      {e.description}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-rose-600">
                      {sym}{Number(e.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
