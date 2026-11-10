import React from 'react';
import {
  X,
  User,
  HeartPulse,
  Clock,
  FileText,
  Printer,
  Stethoscope,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Patient, DailyVisit, Prescription } from '../types/clinic';

interface PatientRecordModalProps {
  patient: Patient | null;
  visits: DailyVisit[];
  prescriptions: Prescription[];
  onClose: () => void;
  onLogVisit: (patientId: string) => void;
  onPrintPrescription: (prescriptionId: string) => void;
}

export const PatientRecordModal: React.FC<PatientRecordModalProps> = ({
  patient,
  visits,
  prescriptions,
  onClose,
  onLogVisit,
  onPrintPrescription
}) => {
  if (!patient) return null;

  const patientVisits = visits.filter((v) => v.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((r) => r.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{patient.name}</h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-sky-100 text-sky-800 rounded-md font-semibold">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Registered on {patient.regDate} · {patient.age} Yrs / {patient.gender} · {patient.mobile}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onLogVisit(patient.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Visit</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Clinical Demographics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Blood Group</span>
              <span className="font-bold text-slate-900">{patient.bloodGroup || 'Unspecified'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Latest BP</span>
              <span className="font-mono font-bold text-slate-900">{patient.bp || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Weight</span>
              <span className="font-mono font-bold text-slate-900">
                {patient.weight ? `${patient.weight} kg` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Heart Pulse</span>
              <span className="font-mono font-bold text-slate-900">
                {patient.pulse ? `${patient.pulse} bpm` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">SpO2 Oxygen</span>
              <span className="font-mono font-bold text-slate-900">
                {patient.spo2 ? `${patient.spo2}%` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Address</span>
              <span className="font-medium text-slate-800 truncate block">
                {patient.address || 'Not specified'}
              </span>
            </div>
          </div>

          {/* Clinical Profile & Allergies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                <span>Primary Complaint & Medical History</span>
              </h4>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                {patient.complaint || 'No primary complaint logged'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {patient.history || 'No prior medical/surgical history on record.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Allergies & Clinical Notes</span>
              </h4>
              <div className="text-xs mb-2">
                <span className="font-semibold text-slate-600">Known Allergies: </span>
                <span className={`font-semibold ${patient.allergies ? 'text-rose-600' : 'text-slate-500'}`}>
                  {patient.allergies || 'No known drug or food allergies declared'}
                </span>
              </div>
              <p className="text-xs text-slate-600 italic">
                {patient.notes ? `“${patient.notes}”` : 'No confidential notes recorded.'}
              </p>
            </div>
          </div>

          {/* Consultation History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Consultation Timeline ({patientVisits.length})</span>
              </h4>
            </div>

            {patientVisits.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                {patientVisits.map((v) => (
                  <div key={v.id} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{v.date}</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {v.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        {v.bp && (
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                            BP: {v.bp}
                          </span>
                        )}
                        {v.weight && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {v.weight} kg
                          </span>
                        )}
                        {v.pulse && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {v.pulse} bpm
                          </span>
                        )}
                        {v.spo2 && (
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                            {v.spo2}% SpO2
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-0.5">
                      Diagnosis: <span className="text-sky-700">{v.diagnosis}</span>
                    </p>
                    {v.complaint && (
                      <p className="text-xs text-slate-600 mb-1">
                        <span className="font-medium text-slate-500">Symptoms:</span> {v.complaint}
                      </p>
                    )}
                    {v.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {v.notes}
                      </p>
                    )}
                    {v.followUp && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-2">
                        Follow-up scheduled: {v.followUp}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Stethoscope className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No consultation visits recorded yet.</p>
              </div>
            )}
          </div>

          {/* Prescriptions History */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Prescriptions Issued ({patientPrescriptions.length})</span>
            </h4>

            {patientPrescriptions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patientPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{rx.date}</span>
                        <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {rx.id}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mb-2">
                        {rx.diagnosis}
                      </p>
                      <div className="space-y-1 mb-3">
                        {rx.medicines.map((m, idx) => (
                          <div
                            key={idx}
                            className="text-xs flex items-center justify-between text-slate-600 py-0.5 border-b border-slate-100 last:border-0"
                          >
                            <span className="font-medium text-slate-800">{m.name}</span>
                            <span className="text-[11px] text-slate-500">{m.freq} ({m.days})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {rx.followUp ? `Follow-up: ${rx.followUp}` : 'As needed'}
                      </span>
                      <button
                        onClick={() => {
                          onPrintPrescription(rx.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Rx</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No prescriptions issued yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-300 shadow-xs"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
};
