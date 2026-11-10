import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Users,
  Stethoscope,
  LineChart,
  FileText,
  Receipt,
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ClinicData } from '../types/clinic';
import { exportFullMasterWorkbook, exportModuleToExcel } from '../utils/excelExport';

interface ExportCenterViewProps {
  data: ClinicData;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExportCenterView: React.FC<ExportCenterViewProps> = ({ data, onShowToast }) => {
  const handleExportFull = () => {
    try {
      exportFullMasterWorkbook(data);
      onShowToast('Master Clinic Workbook (.xlsx) generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to generate master Excel file', 'error');
    }
  };

  const handleExportModule = (
    moduleName: 'patients' | 'visits' | 'vitals' | 'prescriptions' | 'expenses' | 'collections'
  ) => {
    try {
      exportModuleToExcel(moduleName, data);
      onShowToast(`${moduleName.toUpperCase()} exported to Excel!`, 'success');
    } catch (err) {
      console.error(err);
      onShowToast(`Failed to export ${moduleName}`, 'error');
    }
  };

  const cards = [
    {
      id: 'patients' as const,
      title: 'Patient Directory Database',
      desc: 'Demographic, contact details, blood groups, and initial clinical baseline records.',
      count: `${data.patients.length} registered patients`,
      icon: Users,
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      id: 'visits' as const,
      title: 'Daily Consultation Records',
      desc: 'All recorded doctor visits, presenting symptoms, diagnoses, and follow-up schedules.',
      count: `${data.visits.length} consultations`,
      icon: Stethoscope,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'vitals' as const,
      title: 'Vitals Progression History',
      desc: 'Chronological clinical vitals: Blood Pressure, Temperature, Heart Pulse, and SpO2.',
      count: `${data.visits.length} checkpoints`,
      icon: LineChart,
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    {
      id: 'prescriptions' as const,
      title: 'Prescriptions Register',
      desc: 'Itemized medication regimens, dosages, frequencies, durations, and diagnostic tests.',
      count: `${data.prescriptions.length} prescriptions issued`,
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'expenses' as const,
      title: 'Clinic Expenses Ledger',
      desc: 'Itemized practice expenditures, pharmacy restock, utility payments, and salaries.',
      count: `${data.expenses.length} expenditure entries`,
      icon: Receipt,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'collections' as const,
      title: 'Collections & Billing',
      desc: 'Patient consultation fee receipts, payment modes (Cash/UPI/Card), and invoice statuses.',
      count: `${data.collections.length} payment records`,
      icon: CreditCard,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Excel Data Export Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate official Microsoft Excel (.xlsx) spreadsheets using native multi-sheet architecture
        </p>
      </div>

      {/* Hero Master Export Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-teal-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-sky-200 border border-white/20">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Multi-Sheet Workbook Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Export Complete Clinic Database
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed">
            Download a unified, professionally structured Microsoft Excel workbook containing all practice
            records: Patients, Daily Visits, Vitals History, Prescriptions, Expenses, Collections, and
            an Executive Summary sheet.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportFull}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 text-sm font-bold shadow-lg hover:bg-slate-100 hover:shadow-xl transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Download Master Database (.xlsx)</span>
            </button>
            <span className="text-xs text-slate-300">
              Compatible with Microsoft Excel, Apple Numbers, and Google Sheets
            </span>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </div>

      {/* Individual Module Exports Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Individual Module Spreadsheets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {c.count}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{c.desc}</p>
                </div>

                <button
                  onClick={() => handleExportModule(c.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
