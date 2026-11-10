import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { Prescription, PrescribedMedicine, Patient } from '../types/clinic';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: Prescription) => void;
  patients: Patient[];
  defaultDoctorName: string;
  initialData?: Prescription | null;
  preSelectedPatientId?: string;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  defaultDoctorName,
  initialData,
  preSelectedPatientId
}) => {
  const [patientId, setPatientId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([
    { name: '', dosage: '', freq: '1-0-1 (BD)', days: '5 Days', instructions: 'After meals' },
    { name: '', dosage: '', freq: '1-0-0 (Morning)', days: '30 Days', instructions: 'After breakfast' }
  ]);
  const [tests, setTests] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');
  const [followUp, setFollowUp] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>(defaultDoctorName);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDate(initialData.date);
      setDiagnosis(initialData.diagnosis);
      setMedicines(initialData.medicines.length ? initialData.medicines : [
        { name: '', dosage: '', freq: '1-0-1 (BD)', days: '5 Days', instructions: 'After meals' }
      ]);
      setTests(initialData.tests || '');
      setAdvice(initialData.advice || '');
      setFollowUp(initialData.followUp || '');
      setDoctorName(initialData.doctorName || defaultDoctorName);
    } else {
      const targetId = preSelectedPatientId || (patients.length > 0 ? patients[0].id : '');
      setPatientId(targetId);
      setDate(new Date().toISOString().split('T')[0]);
      setDiagnosis('');
      setMedicines([
        { name: '', dosage: '', freq: '1-0-1 (BD)', days: '5 Days', instructions: 'After meals' },
        { name: '', dosage: '', freq: '1-0-0 (Morning)', days: '30 Days', instructions: 'After breakfast' }
      ]);
      setTests('');
      setAdvice('Adequate rest, hydration, and salt restriction as applicable.');
      setFollowUp('');
      setDoctorName(defaultDoctorName);
    }
    setErrors({});
  }, [initialData, preSelectedPatientId, defaultDoctorName, patients, isOpen]);

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === patientId);

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', freq: '1-0-1 (BD)', days: '5 Days', instructions: 'After food' }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof PrescribedMedicine, val: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: val };
    setMedicines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientId) newErrors.patientId = 'Please select a patient';
    if (!diagnosis.trim()) newErrors.diagnosis = 'Provisional or clinical diagnosis required';

    const validMeds = medicines.filter((m) => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      newErrors.medicines = 'Please prescribe at least one valid medication';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Prescription = {
      id: initialData?.id || `RX-${Date.now().toString().slice(-5)}`,
      patientId,
      patientName: currentPatient ? currentPatient.name : 'Unknown Patient',
      date,
      diagnosis: diagnosis.trim(),
      medicines: validMeds,
      tests: tests.trim() || undefined,
      advice: advice.trim() || undefined,
      followUp: followUp || undefined,
      doctorName: doctorName.trim() || defaultDoctorName
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? `Edit Prescription (${initialData.id})` : 'Compose Digital Prescription'}
              </h3>
              <p className="text-xs text-slate-500">
                Add prescribed medications, diagnostic tests, and clinical advice
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Row: Patient, Date, Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Prescription Date *
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
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                placeholder="e.g. Essential Hypertension / URTI"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                  errors.diagnosis ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
                }`}
              />
              {errors.diagnosis && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.diagnosis}</p>
              )}
            </div>
          </div>

          {/* Patient Quick Info Strip */}
          {currentPatient && (
            <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <span>Age/Gender: <strong>{currentPatient.age} Yrs / {currentPatient.gender}</strong></span>
              <span>·</span>
              <span>Weight: <strong>{currentPatient.weight ? `${currentPatient.weight} kg` : '—'}</strong></span>
              <span>·</span>
              <span>BP: <strong className="font-mono">{currentPatient.bp || '—'}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Allergies: </span>
                <strong className={currentPatient.allergies ? 'text-rose-600' : 'text-slate-600'}>
                  {currentPatient.allergies || 'None declared'}
                </strong>
              </span>
            </div>
          )}

          {/* Medicines Dynamic Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                Prescribed Medications
              </h4>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine Row</span>
              </button>
            </div>

            {errors.medicines && (
              <p className="text-xs text-rose-500 mb-2 font-medium">{errors.medicines}</p>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-[30%]">Medicine & Strength</th>
                    <th className="py-2.5 px-3 w-[15%]">Dosage</th>
                    <th className="py-2.5 px-3 w-[20%]">Frequency</th>
                    <th className="py-2.5 px-3 w-[12%]">Duration</th>
                    <th className="py-2.5 px-3 w-[18%]">Instructions</th>
                    <th className="py-2.5 px-2 w-[5%] text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {medicines.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. Paracetamol 650mg"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:border-sky-500 outline-none font-medium"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. 1 Tablet / 5ml"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:border-sky-500 outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={med.freq}
                          onChange={(e) => handleMedicineChange(idx, 'freq', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50/50 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:border-sky-500 outline-none"
                        >
                          <option value="1-0-1 (BD)">1-0-1 (Twice daily)</option>
                          <option value="1-1-1 (TID)">1-1-1 (Thrice daily)</option>
                          <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                          <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                          <option value="SOS (As needed)">SOS (As needed)</option>
                          <option value="Once a week">Once a week</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. 5 Days"
                          value={med.days}
                          onChange={(e) => handleMedicineChange(idx, 'days', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:border-sky-500 outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. After food"
                          value={med.instructions}
                          onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:border-sky-500 outline-none"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          disabled={medicines.length <= 1}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tests & Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Diagnostic Investigations / Tests Advised
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Complete Blood Count (CBC), Fasting Blood Glucose, Lipid Profile..."
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                General Clinical Advice / Dietary Precautions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Drink 2.5L water daily, brisk walk 30 mins, low sodium diet..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Follow-up & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Next Follow-Up Consultation
              </label>
              <input
                type="date"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Prescribing Doctor Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              />
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Prescription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
