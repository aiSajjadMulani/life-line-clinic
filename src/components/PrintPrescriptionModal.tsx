import React from 'react';
import { X, Printer } from 'lucide-react';
import { Prescription, Patient, ClinicSettings } from '../types/clinic';

interface PrintPrescriptionModalProps {
  prescription: Prescription | null;
  patient: Patient | null;
  settings: ClinicSettings;
  onClose: () => void;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  prescription,
  patient,
  settings,
  onClose
}) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[95vh] flex flex-col print-container">
        {/* Modal Controls (Hidden during print) */}
        <div className="no-print px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Prescription Print Preview</span>
            <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
              {prescription.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-sm shadow-sky-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentic Printable Letterhead Document */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-slate-900 bg-white">
          {/* Clinic & Doctor Letterhead Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <h1 className="text-2xl font-black text-sky-800 tracking-tight uppercase">
                {settings.clinicName || 'Life Line Clinic'}
              </h1>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {settings.clinicSubtitle || 'Medical Center & Comprehensive Clinical Practice'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {settings.clinicAddress || '104 Healthcare Boulevard, Medical Enclave'}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong>Tel:</strong> {settings.clinicPhone || '+1 (555) 345-6789'}
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-base font-bold text-slate-900">
                {prescription.doctorName || settings.doctorName}
              </h2>
              <p className="text-xs text-slate-600">
                {settings.doctorDegrees || 'MBBS, MD (General Medicine)'}
              </p>
              {settings.doctorRegNo && (
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Reg No: {settings.doctorRegNo}
                </p>
              )}
              <div className="mt-3 inline-block px-2.5 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">
                Date: <strong>{prescription.date}</strong>
              </div>
            </div>
          </div>

          {/* Patient Demographics Strip */}
          <div className="my-5 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-6 gap-2">
            <div>
              <span className="text-slate-500 block text-[11px]">Patient Name</span>
              <strong className="text-slate-900">{prescription.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Patient ID</span>
              <strong className="font-mono text-slate-900">{patient?.id || prescription.patientId}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age / Gender</span>
              <strong className="text-slate-900">
                {patient ? `${patient.age}y / ${patient.gender}` : '—'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Phone</span>
              <strong className="text-slate-900">{patient?.mobile || '—'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Weight</span>
              <strong className="text-slate-900">{patient?.weight ? `${patient.weight} kg` : '—'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Blood Pressure</span>
              <strong className="font-mono text-slate-900">{patient?.bp || '—'}</strong>
            </div>
          </div>

          {/* Provisional Diagnosis */}
          <div className="mb-6 pb-2 border-b border-dashed border-slate-200 text-xs">
            <span className="font-semibold text-slate-500">Provisional Diagnosis: </span>
            <span className="font-bold text-slate-900 text-sm ml-1">{prescription.diagnosis}</span>
          </div>

          {/* Prescription Body & Rx Symbol */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-black text-sky-800 leading-none">℞</span>
            </div>

            {/* Medicines Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700">
                  <th className="py-2 px-2 w-[6%] font-bold">#</th>
                  <th className="py-2 px-2 w-[34%] font-bold">Medicine / Generic Formulation</th>
                  <th className="py-2 px-2 w-[15%] font-bold">Dosage</th>
                  <th className="py-2 px-2 w-[20%] font-bold">Frequency</th>
                  <th className="py-2 px-2 w-[12%] font-bold">Duration</th>
                  <th className="py-2 px-2 w-[13%] font-bold">Timing / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prescription.medicines.map((m, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-2 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-2 text-slate-700">{m.dosage || '—'}</td>
                    <td className="py-2.5 px-2 text-slate-700 font-medium">{m.freq || '—'}</td>
                    <td className="py-2.5 px-2 text-slate-700">{m.days || '—'}</td>
                    <td className="py-2.5 px-2 text-slate-600 italic">{m.instructions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Investigations and Advice Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-6 border-t border-slate-200">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Diagnostic Tests / Investigations Advised
                </h5>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {prescription.tests || 'None advised at this visit.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  General Dietary & Lifestyle Advice
                </h5>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {prescription.advice || 'Follow balanced diet, hydration, and regular medications.'}
                </p>
              </div>
            </div>
          </div>

          {/* Letterhead Footer */}
          <div className="mt-14 pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
            <div>
              <p className="text-slate-600">
                <strong>Next Review:</strong>{' '}
                <span className="font-semibold text-sky-800">
                  {prescription.followUp || 'As needed / SOS'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Please bring this prescription for your follow-up visit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 border-b border-slate-800 mb-1"></div>
              <p className="font-bold text-slate-900">
                {prescription.doctorName || settings.doctorName}
              </p>
              <p className="text-[11px] text-slate-500">Authorized Medical Signature & Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
