import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { Patient } from '../types/clinic';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  initialData?: Patient | null;
  nextPatientId: string;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  nextPatientId
}) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    id: nextPatientId,
    regDate: new Date().toISOString().split('T')[0],
    name: '',
    age: 30,
    gender: 'Male',
    mobile: '',
    bloodGroup: '',
    address: '',
    height: '',
    weight: '',
    bp: '',
    temp: '',
    pulse: '',
    spo2: '',
    complaint: '',
    allergies: '',
    history: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: nextPatientId,
        regDate: new Date().toISOString().split('T')[0],
        name: '',
        age: 35,
        gender: 'Male',
        mobile: '',
        bloodGroup: '',
        address: '',
        height: '',
        weight: '',
        bp: '120/80',
        temp: 98.6,
        pulse: 72,
        spo2: 98,
        complaint: '',
        allergies: '',
        history: '',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, nextPatientId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Patient name is required';
    if (!formData.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.complaint?.trim()) newErrors.complaint = 'Chief complaint is required';
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = 'Valid age is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData as Patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? `Edit Patient (${initialData.id})` : 'Register New Patient'}
              </h3>
              <p className="text-xs text-slate-500">
                Enter demographic and clinical baseline information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
              1. Patient Identification & Demographics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 text-slate-600 font-mono text-sm rounded-xl border border-slate-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Registration Date *
                </label>
                <input
                  type="date"
                  value={formData.regDate}
                  onChange={(e) => setFormData({ ...formData, regDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                    errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-sky-500'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="130"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
                {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. 555-019-2831"
                  className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                    errors.mobile ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
                  }`}
                />
                {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup || ''}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                >
                  <option value="">Unknown / None</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, apartment, city"
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Section 2: Clinical Baseline & Vitals */}
          <div>
            <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
              2. Initial Clinical Baseline & Vitals
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  BP (mmHg)
                </label>
                <input
                  type="text"
                  value={formData.bp || ''}
                  onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                  placeholder="120/80"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="68.0"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="165"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temp || ''}
                  onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
                  placeholder="98.6"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  value={formData.pulse || ''}
                  onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                  placeholder="72"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={formData.spo2 || ''}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                  placeholder="98"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Medical Notes & Allergies */}
          <div>
            <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
              3. Chief Complaint & Clinical Background
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Chief Complaint *
                </label>
                <input
                  type="text"
                  value={formData.complaint || ''}
                  onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                  placeholder="e.g. Migraine, chronic knee stiffness, acute fever"
                  className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                    errors.complaint ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
                  }`}
                />
                {errors.complaint && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.complaint}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Known Drug / Food Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Sulfa drugs, Peanuts (or None)"
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Past Medical / Surgical History
                </label>
                <textarea
                  rows={2}
                  value={formData.history || ''}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Coronary stent in 2021..."
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor Confidential Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Initial clinical impressions, lifestyle recommendations..."
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Patient Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
