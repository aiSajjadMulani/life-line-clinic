import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import {
  LineChart,
  HeartPulse,
  Scale,
  Activity,
  FileSpreadsheet,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Patient, DailyVisit } from '../types/clinic';

Chart.register(...registerables);

interface VitalsTrackerViewProps {
  patients: Patient[];
  visits: DailyVisit[];
  onExportExcel: () => void;
  selectedPatientIdProp?: string;
}

export const VitalsTrackerView: React.FC<VitalsTrackerViewProps> = ({
  patients,
  visits,
  onExportExcel,
  selectedPatientIdProp
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    selectedPatientIdProp || (patients.length > 0 ? patients[0].id : '')
  );

  const bpChartRef = useRef<HTMLCanvasElement | null>(null);
  const wtChartRef = useRef<HTMLCanvasElement | null>(null);
  const bpChartInstance = useRef<Chart | null>(null);
  const wtChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (selectedPatientIdProp) {
      setSelectedPatientId(selectedPatientIdProp);
    } else if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [selectedPatientIdProp, patients, selectedPatientId]);

  const currentPatient = patients.find((p) => p.id === selectedPatientId);

  // Chronological visits for this patient
  const patientVisits = visits
    .filter((v) => v.patientId === selectedPatientId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Chart setup
  useEffect(() => {
    if (!bpChartRef.current || !wtChartRef.current) return;

    if (bpChartInstance.current) bpChartInstance.current.destroy();
    if (wtChartInstance.current) wtChartInstance.current.destroy();

    const dates: string[] = [];
    const systolicData: (number | null)[] = [];
    const diastolicData: (number | null)[] = [];
    const pulseData: (number | null)[] = [];
    const weightData: (number | null)[] = [];
    const spo2Data: (number | null)[] = [];

    patientVisits.forEach((v) => {
      dates.push(v.date);

      if (v.bp && v.bp.includes('/')) {
        const parts = v.bp.split('/');
        systolicData.push(Number(parts[0]) || null);
        diastolicData.push(Number(parts[1]) || null);
      } else {
        systolicData.push(null);
        diastolicData.push(null);
      }

      pulseData.push(v.pulse ? Number(v.pulse) : null);
      weightData.push(v.weight ? Number(v.weight) : null);
      spo2Data.push(v.spo2 ? Number(v.spo2) : null);
    });

    const hasData = dates.length > 0;
    const chartLabels = hasData ? dates : ['No consultation records'];

    // 1. Blood Pressure & Heart Rate Line Chart
    bpChartInstance.current = new Chart(bpChartRef.current, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Systolic BP (mmHg)',
            data: hasData ? systolicData : [null],
            borderColor: '#e11d48',
            backgroundColor: '#e11d48',
            pointBackgroundColor: '#e11d48',
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Diastolic BP (mmHg)',
            data: hasData ? diastolicData : [null],
            borderColor: '#0284c7',
            backgroundColor: '#0284c7',
            pointBackgroundColor: '#0284c7',
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: 'Pulse (bpm)',
            data: hasData ? pulseData : [null],
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            borderDash: [4, 4],
            pointBackgroundColor: '#10b981',
            tension: 0.3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 40,
            ticks: { font: { family: 'JetBrains Mono', size: 11 } },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
            grid: { display: false }
          }
        }
      }
    });

    // 2. Weight & SpO2 Chart
    wtChartInstance.current = new Chart(wtChartRef.current, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Weight (kg)',
            data: hasData ? weightData : [null],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointBackgroundColor: '#f59e0b',
            tension: 0.3,
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Oxygen Saturation SpO2 (%)',
            data: hasData ? spo2Data : [null],
            borderColor: '#0f766e',
            backgroundColor: '#0f766e',
            pointBackgroundColor: '#0f766e',
            tension: 0.3,
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Weight (kg)', font: { size: 11 } },
            ticks: { font: { family: 'JetBrains Mono', size: 11 } },
            grid: { color: 'rgba(226, 232, 240, 0.6)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 85,
            max: 100,
            title: { display: true, text: 'SpO2 (%)', font: { size: 11 } },
            ticks: { font: { family: 'JetBrains Mono', size: 11 } },
            grid: { drawOnChartArea: false }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (bpChartInstance.current) bpChartInstance.current.destroy();
      if (wtChartInstance.current) wtChartInstance.current.destroy();
    };
  }, [patientVisits]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Patient Health History & Vitals Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect physiological markers, arterial blood pressure progression, weight, and heart rate
          </p>
        </div>

        <button
          onClick={onExportExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Vitals (.xlsx)</span>
        </button>
      </div>

      {/* Patient Selector Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Patient to View Historical Timeline
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 text-sm font-semibold text-slate-900 rounded-xl border border-slate-300 focus:border-sky-500 focus:bg-white outline-none transition-all"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id} · {p.age}y / {p.gender} · {p.mobile || 'No phone'})
                </option>
              ))}
            </select>
          </div>

          {currentPatient && (
            <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[11px]">Baseline BP</span>
                <span className="font-mono font-bold text-slate-900">{currentPatient.bp || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Weight</span>
                <span className="font-mono font-bold text-slate-900">
                  {currentPatient.weight ? `${currentPatient.weight} kg` : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Blood</span>
                <span className="font-bold text-rose-700">{currentPatient.bloodGroup || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Visits on Record</span>
                <span className="font-mono font-bold text-sky-700">{patientVisits.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progression Graphs Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure & Pulse Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Blood Pressure (BP) & Heart Rate (Pulse) Trends
              </h3>
              <p className="text-xs text-slate-500">Systolic vs. Diastolic vs. Resting Pulse</p>
            </div>
          </div>
          <div className="h-72 relative">
            <canvas ref={bpChartRef} />
          </div>
        </div>

        {/* Weight & SpO2 Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Scale className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weight & Oxygen Saturation (SpO2) Trends
              </h3>
              <p className="text-xs text-slate-500">Dual-axis body mass and arterial oxygenation</p>
            </div>
          </div>
          <div className="h-72 relative">
            <canvas ref={wtChartRef} />
          </div>
        </div>
      </div>

      {/* Chronological Vitals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Chronological Vitals Log for {currentPatient?.name || 'Selected Patient'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {patientVisits.length} consultation checkpoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Visit Date</th>
                <th className="py-3 px-4">Weight (kg)</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4">Temperature (°F)</th>
                <th className="py-3 px-4">Pulse (bpm)</th>
                <th className="py-3 px-4">SpO2 (%)</th>
                <th className="py-3 px-4">Consultation Diagnosis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {patientVisits.length > 0 ? (
                patientVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{v.date}</td>
                    <td className="py-3 px-4 text-slate-800">
                      {v.weight ? `${v.weight} kg` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {v.bp ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                          {v.bp}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {v.temp ? `${v.temp} °F` : '—'}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">
                      {v.pulse ? `${v.pulse} bpm` : '—'}
                    </td>
                    <td className="py-3 px-4 text-teal-700 font-bold">
                      {v.spo2 ? `${v.spo2} %` : '—'}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700 font-medium">
                      {v.diagnosis || '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center font-sans text-slate-400">
                    No recorded vitals for this patient yet. Log a daily consultation to begin tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
