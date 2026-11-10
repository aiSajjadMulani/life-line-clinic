import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Trash2,
  Pen,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import { Prescription } from '../types/clinic';

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  onOpenNewRx: () => void;
  onEditRx: (prescription: Prescription) => void;
  onDeleteRx: (prescriptionId: string) => void;
  onPrintRx: (prescriptionId: string) => void;
  onSelectPatient: (patientId: string) => void;
  onExportExcel: () => void;
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  prescriptions,
  onOpenNewRx,
  onEditRx,
  onDeleteRx,
  onPrintRx,
  onSelectPatient,
  onExportExcel
}) => {
  const [search, setSearch] = useState('');

  const filtered = prescriptions.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.diagnosis.toLowerCase().includes(q) ||
      r.medicines.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Prescriptions Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulate digital prescriptions, manage pharmaceutical regimens, print authentic letterheads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Prescriptions (.xlsx)</span>
          </button>
          <button
            onClick={onOpenNewRx}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Prescription</span>
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
            placeholder="Search by patient name, medication name, Rx ID, diagnosis..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        {search && (
          <button
            onClick={() => setSearch('')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Rx ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Medicines Prescribed</th>
                <th className="py-3 px-4">Follow-Up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-teal-800 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                        {r.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectPatient(r.patientId)}
                        className="hover:text-sky-600 hover:underline text-left block"
                      >
                        {r.patientName}
                      </button>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {r.patientId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 max-w-[180px] truncate">
                      {r.diagnosis}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex flex-wrap gap-1">
                        {r.medicines.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            title={`${m.name} - ${m.dosage} (${m.freq})`}
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {r.followUp ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {r.followUp}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">As needed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onPrintRx(r.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                        title="Print Authentic Letterhead Prescription"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                      <button
                        onClick={() => onEditRx(r)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Prescription"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRx(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Prescription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No prescriptions match your search criteria.</p>
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
