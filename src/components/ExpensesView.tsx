import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  FileSpreadsheet,
  Trash2,
  Filter,
  DollarSign
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types/clinic';

interface ExpensesViewProps {
  expenses: Expense[];
  onOpenNewExpense: () => void;
  onDeleteExpense: (expenseId: string) => void;
  onExportExcel: () => void;
  currency: string;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenNewExpense,
  onDeleteExpense,
  onExportExcel,
  currency
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = todayStr.substring(0, 7);

  // Totals
  let todayTotal = 0;
  let monthlyTotal = 0;
  let filteredTotal = 0;

  expenses.forEach((e) => {
    const amt = Number(e.amount || 0);
    if (e.date === todayStr) todayTotal += amt;
    if (e.date && e.date.startsWith(currentMonth)) monthlyTotal += amt;
  });

  const filtered = expenses.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.description.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q)) ||
      e.paymentMethod.toLowerCase().includes(q);

    const matchCategory = categoryFilter ? e.category === categoryFilter : true;
    const matchDate = dateFilter ? e.date === dateFilter : true;

    return matchSearch && matchCategory && matchDate;
  });

  filtered.forEach((e) => {
    filteredTotal += Number(e.amount || 0);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinic Expenses Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track operational disbursements, pharmaceuticals restocking, utility bills, and staff salaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Expenses (.xlsx)</span>
          </button>
          <button
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm shadow-rose-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Log Practice Expense</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Total Expense
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {currency}{todayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Practice outflows today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly Total Expense
            </span>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1 font-mono">
              {currency}{monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Current calendar month total</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Filtered Entries Sum
            </span>
            <h3 className="text-2xl font-extrabold text-sky-700 mt-1 font-mono">
              {currency}{filteredTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">{filtered.length} matched ledger rows</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
            <Filter className="w-6 h-6" />
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
            placeholder="Search description, bill reference, vendor..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="Medical Supplies">Medical Supplies</option>
            <option value="Medicine Purchase">Medicine Purchase</option>
            <option value="Electricity">Electricity</option>
            <option value="Rent">Rent</option>
            <option value="Staff Salary">Staff Salary</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          />

          {(search || categoryFilter || dateFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setDateFilter('');
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Item / Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount ({currency})</th>
                <th className="py-3 px-4">Notes / Invoice Ref</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{e.description}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{e.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600 text-sm whitespace-nowrap">
                      {currency}{Number(e.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                      {e.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteExpense(e.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Expense Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No expenses match your filter criteria.</p>
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
