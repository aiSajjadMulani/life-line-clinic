import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  UserCheck,
  Coins,
  ShieldAlert
} from 'lucide-react';
import { ClinicSettings } from '../types/clinic';

interface SettingsViewProps {
  settings: ClinicSettings;
  onSaveSettings: (settings: ClinicSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData
}) => {
  const [formData, setFormData] = useState<ClinicSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Warning: This will reload default demonstration records and erase your custom modifications. Continue?'
      )
    ) {
      onResetDemoData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Clinic Settings & Customization
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure clinic headers, doctor credentials, localized currency, and local data persistence
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinic Identification */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Clinic Identity & Header</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Clinic Practice Name *
              </label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Clinic Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.clinicSubtitle}
                onChange={(e) => setFormData({ ...formData, clinicSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Practice Address *
              </label>
              <input
                type="text"
                required
                value={formData.clinicAddress}
                onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Contact Phone & Email *
              </label>
              <input
                type="text"
                required
                value={formData.clinicPhone}
                onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Doctor Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Chief Physician Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Doctor Name *
              </label>
              <input
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Degrees & Qualifications *
              </label>
              <input
                type="text"
                required
                value={formData.doctorDegrees}
                onChange={(e) => setFormData({ ...formData, doctorDegrees: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Medical Registration Number
              </label>
              <input
                type="text"
                value={formData.doctorRegNo}
                onChange={(e) => setFormData({ ...formData, doctorRegNo: e.target.value })}
                className="w-full px-3.5 py-2 bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* System Currency */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Coins className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">System Currency Localization</h3>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Active Currency Symbol
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3.5 py-2 bg-white text-sm font-bold text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
            >
              <option value="$">$ (USD)</option>
              <option value="₹">₹ (INR)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="AED ">AED (Emirati Dirham)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-sm shadow-sky-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Configuration</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>
    </div>
  );
};
