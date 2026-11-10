import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Save, User } from 'lucide-react';
import { DailyVisit, Patient } from '../types/clinic';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit: DailyVisit) => void;
  patients: Patient[];
  preSelectedPatientId?: string;
  initialData?: DailyVisit | null;
}

export const VisitModal: React.FC<VisitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  preSelectedPatientId,
  initialData
}) => {
  const [patientId, setPatientId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<string | number>('');
  const [bp, setBp] = useState<string>('');
  const [temp, setTemp] = useState<string | number>('');
  const [pulse, setPulse] = useState<string | number>('');
  const [spo2, setSpo2] = useState<string | number>('');
  const [complaint, setComplaint] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [followUp, setFollowUp] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDate(initialData.date);
      setWeight(initialData.weight || '');
      setBp(initialData.bp || '');
      setTemp(initialData.temp || '');
      setPulse(initialData.pulse || '');
      setSpo2(initialData.spo2 || '');
      setComplaint(initialData.complaint);
      setDiagnosis(initialData.diagnosis);
      setFollowUp(initialData.followUp || '');
      setNotes(initialData.notes || '');
    } else {
      const targetId = preSelectedPatientId || (patients.length > 0 ? patients[0].id : '');
      setPatientId(targetId);
      setDate(new Date().toISOString().split('T')[0]);

      const p = patients.find((pat) => pat.id === targetId);
      if (p) {
        setWeight(p.weight || '');
        setBp(p.bp || '');
        setTemp(p.temp || 98.6);
        setPulse(p.pulse || 72);
        setSpo2(p.spo2 || 98);
        setComplaint(p.complaint || '');
      } else {
        setWeight('');
        setBp('');
        setTemp(98.6);
        setPulse(72);
        setSpo2(98);
        setComplaint('');
      }

      setDiagnosis('');
      setFollowUp('');
      setNotes('');
    }
    setErrors({});
  }, [initialData, preSelectedPatientId, patients, isOpen]);

  const handlePatientChange = (id: string) => {
    setPatientId(id);
    const p = patients.find((pat) => pat.id === id);
    if (p && !initialData) {
      if (p.weight) setWeight(p.weight);
      if (p.bp) setBp(p.bp);
      if (p.pulse) setPulse(p.pulse);
      if (p.spo2) setSpo2(p.spo2);
      if (p.complaint) setComplaint(p.complaint);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!patientId) newErrors.patientId = 'Please select a patient';
    if (!complaint.trim()) newErrors.complaint = 'Chief complaint or symptoms required';
    if (!diagnosis.trim()) newErrors.diagnosis = 'Doctor diagnosis required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedPatient = patients.find((p) => p.id === patientId);

    const visitPayload: DailyVisit = {
      id: initialData?.id || `VIS-${Date.now().toString().slice(-5)}`,
      patientId,
      patientName: selectedPatient ? selectedPatient.name : 'Unknown Patient',
      date,
      weight: weight ? Number(weight) : undefined,
      bp: bp.trim() || undefined,
      temp: temp ? Number(temp) : undefined,
      pulse: pulse ? Number(pulse) : undefined,
      spo2: spo2 ? Number(spo2) : undefined,
      complaint: complaint.trim(),
      diagnosis: diagnosis.trim(),
      followUp: followUp || undefined,
      notes: notes.trim() || undefined
    };

    onSave(visitPayload);
    onClose();
  };

  const currentPatient = patients.find((p) => p.id === patientId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? `Edit Consultation (${initialData.id})` : 'Log Daily Consultation Record'}
              </h3>
              <p className="text-xs text-slate-500">Record symptoms, clinical vitals, and diagnosis</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Patient Selection & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Patient *
              </label>
              <select
                value={patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id} - {p.mobile || 'No phone'})
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.patientId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Consultation Date *
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

          {/* Quick Patient Glance */}
          {currentPatient && (
            <div className="flex flex-wrap items-center gap-3 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
              <span>Age/Sex: <strong>{currentPatient.age}y / {currentPatient.gender}</strong></span>
              <span>·</span>
              <span>Blood: <strong>{currentPatient.bloodGroup || 'N/A'}</strong></span>
              <span>·</span>
              <span>Allergies: <strong className={currentPatient.allergies ? 'text-rose-600' : ''}>{currentPatient.allergies || 'None'}</strong></span>
            </div>
          )}

          {/* Consultation Vitals */}
          <div>
            <h4 className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
              Clinical Vitals Recorded Today
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  BP (mmHg)
                </label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
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
                  placeholder="70.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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
                  placeholder="98.6"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  placeholder="74"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  placeholder="99"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm font-mono rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Patient Complaints / Presenting Symptoms *
              </label>
              <input
                type="text"
                placeholder="e.g. Acute productive cough with fever for 2 days"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className={`w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border outline-none ${
                  errors.complaint ? 'border-rose-400' : 'border-slate-300 focus:border-sky-500'
                }`}
              />
              {errors.complaint && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.complaint}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor Diagnosis *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bronchitis / Viral Pharyngitis"
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

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Next Follow-Up Date
                </label>
                <input
                  type="date"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Consultation Advice / Doctor Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Regimen instructions, investigations ordered, precautions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 text-sm rounded-xl border border-slate-300 focus:border-sky-500 outline-none resize-none"
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Consultation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
