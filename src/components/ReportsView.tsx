import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  Filter,
  Calendar
} from 'lucide-react';
import { ClinicData } from '../types/clinic';

Chart.register(...registerables);

interface ReportsViewProps {
  data: ClinicData;
  currency: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ data, currency }) => {
  const [filterMode, setFilterMode] = useState<'today' | 'thisMonth' | 'custom'>('thisMonth');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const trendChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const trendChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = todayStr.substring(0, 7);

  // Filter function
  const dateFilterFn = (dateStr: string) => {
    if (!dateStr) return false;
    if (filterMode === 'today') return dateStr === todayStr;
    if (filterMode === 'thisMonth') return dateStr.startsWith(currentMonth);
    if (filterMode === 'custom') {
      if (startDate && dateStr < startDate) return false;
      if (endDate && dateStr > endDate) return false;
      return true;
    }
    return true;
  };

  const periodVisits = data.visits.filter((v) => dateFilterFn(v.date));
  const periodCollections = data.collections.filter(
    (c) => dateFilterFn(c.date) && c.status === 'Paid'
  );
  const periodExpenses = data.expenses.filter((e) => dateFilterFn(e.date));

  const totalCollections = periodCollections.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const totalExpenses = periodExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netIncome = totalCollections - totalExpenses;

  // Chart Rendering
  useEffect(() => {
    if (!trendChartRef.current || !pieChartRef.current) return;

    if (trendChartInstance.current) trendChartInstance.current.destroy();
    if (pieChartInstance.current) pieChartInstance.current.destroy();

    // 1. Trend Bar Chart: Aggregate by distinct date
    const dateSet = new Set<string>();
    periodCollections.forEach((c) => dateSet.add(c.date));
    periodExpenses.forEach((e) => dateSet.add(e.date));
    const sortedDates = Array.from(dateSet).sort();

    const collByDate: number[] = [];
    const expByDate: number[] = [];

    sortedDates.forEach((d) => {
      const cSum = periodCollections
        .filter((c) => c.date === d)
        .reduce((s, c) => s + Number(c.amount || 0), 0);
      const eSum = periodExpenses
        .filter((e) => e.date === d)
        .reduce((s, e) => s + Number(e.amount || 0), 0);
      collByDate.push(cSum);
      expByDate.push(eSum);
    });

    const hasTimeline = sortedDates.length > 0;

    trendChartInstance.current = new Chart(trendChartRef.current, {
      type: 'bar',
      data: {
        labels: hasTimeline ? sortedDates : ['No transactions in period'],
        datasets: [
          {
            label: 'Collections',
            data: hasTimeline ? collByDate : [0],
            backgroundColor: '#059669',
            borderRadius: 6
          },
          {
            label: 'Expenses',
            data: hasTimeline ? expByDate : [0],
            backgroundColor: '#e11d48',
            borderRadius: 6
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
              label: (ctx) => `${ctx.dataset.label}: ${currency}${Number(ctx.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (v) => `${currency}${v}`
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
            grid: { display: false }
          }
        }
      }
    });

    // 2. Expense Category Pie Chart
    const catMap: Record<string, number> = {};
    periodExpenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount || 0);
    });

    const pieLabels = Object.keys(catMap);
    const pieValues = Object.values(catMap);
    const hasExpenses = pieLabels.length > 0;

    pieChartInstance.current = new Chart(pieChartRef.current, {
      type: 'doughnut',
      data: {
        labels: hasExpenses ? pieLabels : ['No Expenses'],
        datasets: [
          {
            data: hasExpenses ? pieValues : [1],
            backgroundColor: hasExpenses
              ? ['#0284c7', '#0f766e', '#f59e0b', '#e11d48', '#8b5cf6', '#ec4899', '#64748b']
              : ['#e2e8f0']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                hasExpenses
                  ? `${ctx.label}: ${currency}${Number(ctx.raw).toFixed(2)}`
                  : 'No expenses logged'
            }
          }
        }
      }
    });

    return () => {
      if (trendChartInstance.current) trendChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, [periodCollections, periodExpenses, currency]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Clinic Reports & Financial Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Consultation volume, revenue breakdown, expense allocations, and net profit ledger
        </p>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-semibold text-slate-700">Reporting Period:</span>
        </div>

        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as any)}
          className="px-3.5 py-1.5 bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
        >
          <option value="today">Today</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom Date Range</option>
        </select>

        {filterMode === 'custom' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800"
              />
            </div>
          </div>
        )}
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Patient Consultations
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {periodVisits.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">During selected period</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Collections
            </span>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
              {currency}{totalCollections.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Gross paid revenue</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1 font-mono">
              {currency}{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Clinic operational disbursements</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Profit / Income
            </span>
            <h3
              className={`text-2xl font-extrabold mt-1 font-mono ${
                netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {currency}{netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Collections − Expenses</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Collections vs. Expense Timeline</h3>
              <p className="text-xs text-slate-500">Chronological daily distribution</p>
            </div>
          </div>
          <div className="h-72 relative">
            <canvas ref={trendChartRef} />
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <PieChart className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Expense Category Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of clinic practice outlays</p>
            </div>
          </div>
          <div className="h-72 relative flex items-center justify-center">
            <canvas ref={pieChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
