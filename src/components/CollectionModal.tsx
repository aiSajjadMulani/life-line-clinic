import React, { useState, useEffect } from 'react';
import { X, CreditCard, Save } from 'lucide-react';
import { Collection, Patient } from '../types/clinic';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Collection) => void;
  patients: Patient[];
  currency: string;
  initialData?: Collection | null;
  preSelectedPatientId?: string;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  currency,
  initialData,
  preSelectedPatientId
}) => {
  const [patientId, setPatientId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [service, setService] = useState<string>('General Consultation & Prescription');
  const [amount, setAmount] = useState<string | number>('50');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>('Cash');
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDate(initialData.date);
      setService(initialData.service);
      setAmount(initialData.amount);
      setPaymentMethod(initialData.paymentMethod);
      setStatus(initialData.status);
    } else {
      const targetId = preSelectedPatientId || (patients.length > 0 ? patients[0].id : '');
      setPatientId(targetId);
      setDate(new Date().toISOString().split('T')[0]);
      setService('Doctor Consultation Fee');
      setAmount('50');
      setPaymentMethod('Cash');
      setStatus('Paid');
    }
    setErrors({});
  }, [initialData, preSelectedPatientId, patients, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientId) newErrors.patientId = 'Please select a patient';
    if (!service.trim()) newErrors.service = 'Service/treatment description is required';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Valid positive amount required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPatient = patients.find((p) => p.id === patientId);

    const payload: Collection = {
      id: initialData?.id || `COL-${Date.now().toString().slice(-5)}`,
      date,
      patientId,
      patientName: selectedPatient ? selectedPatient.name : 'Unknown Patient',
      service: service.trim(),
      amount: Number(amount),
      paymentMethod,
      status
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? `Edit Receipt (${initialData.id})` : 'Record Patient Payment'}
              </h3>
              <p className="text-xs text-slate-500">Log patient consultation billing and service fees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Patient *
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.patientId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Service / Treatment Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Doctor Consultation, Nebulization, Wound Dressing"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                errors.service ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
              }`}
            />
            {errors.service && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.service}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Amount ({currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border outline-none ${
                  errors.amount ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
                }`}
              />
              {errors.amount && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Payment Mode *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none font-semibold"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
