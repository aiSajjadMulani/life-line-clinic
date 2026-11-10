import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  FileSpreadsheet,
  Eye,
  Pen,
  Trash2,
  Stethoscope,
  Filter
} from 'lucide-react';
import { Patient } from '../types/clinic';

interface PatientsViewProps {
  patients: Patient[];
  onOpenNewPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onSelectPatient: (patientId: string) => void;
  onLogVisit: (patientId: string) => void;
  onExportExcel: () => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onOpenNewPatient,
  onEditPatient,
  onDeletePatient,
  onSelectPatient,
  onLogVisit,
  onExportExcel
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  const filteredPatients = patients.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      p.complaint.toLowerCase().includes(q);

    const matchGender = genderFilter ? p.gender === genderFilter : true;
    const matchBlood = bloodFilter ? p.bloodGroup === bloodFilter : true;

    return matchSearch && matchGender && matchBlood;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Electronic Medical Records (EMR), clinical baseline profiles & historical archives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Patients (.xlsx)</span>
          </button>
          <button
            onClick={onOpenNewPatient}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-600/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
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
            placeholder="Filter by name, Patient ID, phone, symptoms..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-700 rounded-xl border border-slate-200 focus:border-sky-500 outline-none"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          {(search || genderFilter || bloodFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setGenderFilter('');
                setBloodFilter('');
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Blood</th>
                <th className="py-3 px-4">Baseline Vitals</th>
                <th className="py-3 px-4">Chief Complaint</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-sky-700">
                      <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
                        {p.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{p.regDate}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectPatient(p.id)}
                        className="hover:text-sky-600 hover:underline text-left"
                      >
                        {p.name}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {p.age}y / {p.gender}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{p.mobile}</td>
                    <td className="py-3 px-4">
                      {p.bloodGroup ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {p.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.bp ? `BP: ${p.bp}` : '—'} {p.weight ? `· ${p.weight}kg` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={p.complaint}>
                      {p.complaint}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onLogVisit(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Log Consultation Visit"
                      >
                        <Stethoscope className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectPatient(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="View Complete Health Chart"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditPatient(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Demographics"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePatient(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Patient Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No patient records found matching the query.</p>
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
