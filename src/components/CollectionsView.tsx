import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  FileSpreadsheet,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { Collection } from '../types/clinic';

interface CollectionsViewProps {
  collections: Collection[];
  onOpenNewCollection: () => void;
  onDeleteCollection: (collectionId: string) => void;
  onSelectPatient: (patientId: string) => void;
  onExportExcel: () => void;
  currency: string;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  onOpenNewCollection,
  onDeleteCollection,
  onSelectPatient,
  onExportExcel,
  currency
}) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonth = todayStr.substring(0, 7);
  const oneWeekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];

  let todaySum = 0;
  let weeklySum = 0;
  let monthlySum = 0;
  let pendingSum = 0;

  collections.forEach((c) => {
    const amt = Number(c.amount || 0);
    if (c.status === 'Paid') {
      if (c.date === todayStr) todaySum += amt;
      if (c.date >= oneWeekAgo) weeklySum += amt;
      if (c.date && c.date.startsWith(currentMonth)) monthlySum += amt;
    } else {
      pendingSum += amt;
    }
  });

  const filtered = collections.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.patientName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.service.toLowerCase().includes(q);

    const matchMethod = methodFilter ? c.paymentMethod === methodFilter : true;
    const matchStatus = statusFilter ? c.status === statusFilter : true;

    return matchSearch && matchMethod && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Billing & Collections</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log patient consultation billing, treatment fees, payment methods, and invoice receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Collections (.xlsx)</span>
          </button>
          <button
            onClick={onOpenNewCollection}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Collection
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {currency}{todaySum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Paid consultation inflow</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Collection
            </span>
            <h3 className="text-2xl font-extrabold text-teal-700 mt-1 font-mono">
              {currency}{weeklySum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Last 7 days total</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Collection
            </span>
            <h3 className="text-2xl font-extrabold text-sky-700 mt-1 font-mono">
              {currency}{monthlySum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Gross clinic revenue this month</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Invoices
            </span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
              {currency}{pendingSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Unsettled fees awaiting payment</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, invoice receipt #, treatment..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          >
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          {(search || methodFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setMethodFilter('');
                setStatusFilter('');
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Service / Treatment</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount ({currency})</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-800 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {c.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{c.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectPatient(c.patientId)}
                        className="hover:text-sky-600 hover:underline text-left block"
                      >
                        {c.patientName}
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {c.patientId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium max-w-[220px] truncate">
                      {c.service}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.paymentMethod}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {currency}{Number(c.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteCollection(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Payment Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No billing records match your filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
