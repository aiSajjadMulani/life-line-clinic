import React from 'react';
import {
  Activity,
  LayoutDashboard,
  Users,
  Stethoscope,
  LineChart,
  FileText,
  Receipt,
  CreditCard,
  PieChart,
  FileSpreadsheet,
  Settings,
  X,
  UserCheck
} from 'lucide-react';
import { ActivePage, ClinicSettings } from '../types/clinic';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  settings: ClinicSettings;
  isOpen: boolean;
  onClose: () => void;
  counts: {
    patients: number;
    todayVisits: number;
    pendingBills: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  settings,
  isOpen,
  onClose,
  counts
}) => {
  const navItems: Array<{
    id: ActivePage;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Directory', icon: Users, badge: counts.patients },
    { id: 'visits', label: 'Daily Consultations', icon: Stethoscope, badge: counts.todayVisits ? `${counts.todayVisits} today` : undefined, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'vitals', label: 'Vital Records Tracker', icon: LineChart },
    { id: 'prescriptions', label: 'Digital Prescriptions', icon: FileText },
    { id: 'expenses', label: 'Clinic Expenses', icon: Receipt },
    { id: 'collections', label: 'Collections & Fees', icon: CreditCard, badge: counts.pendingBills ? `${counts.pendingBills} pending` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'reports', label: 'Reports & Analytics', icon: PieChart },
    { id: 'export', label: 'Export to Excel', icon: FileSpreadsheet },
    { id: 'settings', label: 'Clinic Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {settings.clinicName || 'Life Line Clinic'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">Medical Center & EMR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Doctor Credentials Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">
                {settings.doctorName || 'Dr. Robert Chen, MD'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {settings.doctorDegrees || 'Chief Medical Officer'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
