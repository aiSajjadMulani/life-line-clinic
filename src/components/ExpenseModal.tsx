import React, { useState, useEffect } from 'react';
import { X, Receipt, Save } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types/clinic';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  initialData?: Expense | null;
  currency: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currency
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Medical Supplies');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string | number>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Cheque'>('Cash');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setAmount(initialData.amount);
      setPaymentMethod(initialData.paymentMethod);
      setNotes(initialData.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Medical Supplies');
      setDescription('');
      setAmount('');
      setPaymentMethod('Cash');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) newErrors.description = 'Expense description is required';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Valid positive amount required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Expense = {
      id: initialData?.id || `EXP-${Date.now().toString().slice(-5)}`,
      date,
      category,
      description: description.trim(),
      amount: Number(amount),
      paymentMethod,
      notes: notes.trim() || undefined
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
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? `Edit Expense (${initialData.id})` : 'Log Clinic Expense'}
              </h3>
              <p className="text-xs text-slate-500">Record practice overheads and supply purchases</p>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Expense Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              >
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Medicine Purchase">Medicine Purchase</option>
                <option value="Electricity">Electricity</option>
                <option value="Rent">Rent</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Item Description / Vendor *
            </label>
            <input
              type="text"
              placeholder="e.g. Disposable gloves, syringe restock, electricity bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                errors.description ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Digital</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Invoice / Receipt Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Invoice #781, wholesale vendor receipt"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
            />
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm shadow-amber-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
