import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  FileSpreadsheet,
  Pen,
  Trash2,
  Calendar,
  Eye
} from 'lucide-react';
import { DailyVisit } from '../types/clinic';

interface VisitsViewProps {
  visits: DailyVisit[];
  onOpenNewVisit: (patientId?: string) => void;
  onEditVisit: (visit: DailyVisit) => void;
  onDeleteVisit: (visitId: string) => void;
  onSelectPatient: (patientId: string) => void;
  onExportExcel: () => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  onOpenNewVisit,
  onEditVisit,
  onDeleteVisit,
  onSelectPatient,
  onExportExcel
}) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredVisits = visits.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      v.patientName.toLowerCase().includes(q) ||
      v.patientId.toLowerCase().includes(q) ||
      v.diagnosis.toLowerCase().includes(q) ||
      v.complaint.toLowerCase().includes(q);

    const matchDate = dateFilter ? v.date === dateFilter : true;
    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Consultation Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record doctor consultations, real-time vitals checks, provisional diagnoses, and clinical advice
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Visits (.xlsx)</span>
          </button>
          <button
            onClick={() => onOpenNewVisit()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Consultation</span>
          </button>
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
            placeholder="Search by patient name, diagnosis, symptoms..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
            />
          </div>

          {(search || dateFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setDateFilter('');
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
                <th className="py-3 px-4">Visit Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Vitals (BP | Temp | Pulse | SpO2 | Wt)</th>
                <th className="py-3 px-4">Complaints / Symptoms</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Follow-Up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {v.date}
                      <span className="block text-[10px] text-slate-400 font-normal">{v.id}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectPatient(v.patientId)}
                        className="hover:text-sky-600 hover:underline text-left block"
                      >
                        {v.patientName}
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {v.patientId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {v.bp ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                            {v.bp}
                          </span>
                        ) : null}
                        {v.temp ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800">
                            {v.temp}°F
                          </span>
                        ) : null}
                        {v.pulse ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800">
                            {v.pulse} bpm
                          </span>
                        ) : null}
                        {v.spo2 ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-teal-50 text-teal-800">
                            {v.spo2}%
                          </span>
                        ) : null}
                        {v.weight ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                            {v.weight}kg
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={v.complaint}>
                      {v.complaint}
                    </td>
                    <td className="py-3 px-4 font-semibold text-sky-800 max-w-[180px] truncate">
                      {v.diagnosis}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {v.followUp ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {v.followUp}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">As needed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onSelectPatient(v.patientId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="View Patient Chart"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditVisit(v)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Consultation"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteVisit(v.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No daily consultation records match your filter.</p>
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
