import React, { useState, useEffect } from 'react';
import {
  ClinicData,
  ActivePage,
  Patient,
  DailyVisit,
  Prescription,
  Expense,
  Collection,
  ClinicSettings
} from './types/clinic';
import { loadClinicData, saveClinicData, getInitialDemoData } from './utils/storage';
import { exportModuleToExcel } from './utils/excelExport';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer, ToastMessage } from './components/Toast';

import { Dashboard } from './components/Dashboard';
import { PatientsView } from './components/PatientsView';
import { VisitsView } from './components/VisitsView';
import { VitalsTrackerView } from './components/VitalsTrackerView';
import { PrescriptionsView } from './components/PrescriptionsView';
import { ExpensesView } from './components/ExpensesView';
import { CollectionsView } from './components/CollectionsView';
import { ReportsView } from './components/ReportsView';
import { ExportCenterView } from './components/ExportCenterView';
import { SettingsView } from './components/SettingsView';

import { PatientModal } from './components/PatientModal';
import { PatientRecordModal } from './components/PatientRecordModal';
import { VisitModal } from './components/VisitModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { PrintPrescriptionModal } from './components/PrintPrescriptionModal';
import { ExpenseModal } from './components/ExpenseModal';
import { CollectionModal } from './components/CollectionModal';

export default function App() {
  const [data, setData] = useState<ClinicData>(() => loadClinicData());
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals & Context States
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [isPatientRecordOpen, setIsPatientRecordOpen] = useState(false);
  const [selectedPatientIdForRecord, setSelectedPatientIdForRecord] = useState<string | null>(null);

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<DailyVisit | null>(null);
  const [preSelectedPatientIdForVisit, setPreSelectedPatientIdForVisit] = useState<string | undefined>();

  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [editingRx, setEditingRx] = useState<Prescription | null>(null);

  const [isPrintRxOpen, setIsPrintRxOpen] = useState(false);
  const [printingRxId, setPrintingRxId] = useState<string | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [vitalsPatientId, setVitalsPatientId] = useState<string | undefined>();

  // Persist data on every update
  const updateData = (newData: ClinicData) => {
    setData(newData);
    saveClinicData(newData);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      title
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Patient handlers
  const handleSavePatient = (patient: Patient) => {
    const exists = data.patients.some((p) => p.id === patient.id);
    let updatedPatients: Patient[];
    if (exists) {
      updatedPatients = data.patients.map((p) => (p.id === patient.id ? patient : p));
      showToast('Patient record updated successfully!', 'success');
    } else {
      updatedPatients = [patient, ...data.patients];
      showToast('New patient registered successfully!', 'success');
    }
    updateData({ ...data, patients: updatedPatients });
  };

  const handleDeletePatient = (patientId: string) => {
    if (!window.confirm(`Are you certain you want to delete patient ${patientId}?`)) return;
    const updated = data.patients.filter((p) => p.id !== patientId);
    updateData({ ...data, patients: updated });
    showToast('Patient record deleted', 'info');
  };

  // Visit handlers
  const handleSaveVisit = (visit: DailyVisit) => {
    const exists = data.visits.some((v) => v.id === visit.id);
    let updatedVisits: DailyVisit[];
    if (exists) {
      updatedVisits = data.visits.map((v) => (v.id === visit.id ? visit : v));
      showToast('Consultation record updated.', 'success');
    } else {
      updatedVisits = [visit, ...data.visits];
      showToast('Consultation logged successfully.', 'success');
    }

    // Also update patient's latest vitals in their master profile
    const updatedPatients = data.patients.map((p) => {
      if (p.id === visit.patientId) {
        return {
          ...p,
          bp: visit.bp || p.bp,
          weight: visit.weight || p.weight,
          pulse: visit.pulse || p.pulse,
          spo2: visit.spo2 || p.spo2,
          temp: visit.temp || p.temp
        };
      }
      return p;
    });

    updateData({ ...data, visits: updatedVisits, patients: updatedPatients });
  };

  const handleDeleteVisit = (visitId: string) => {
    if (!window.confirm('Delete this consultation visit record?')) return;
    const updated = data.visits.filter((v) => v.id !== visitId);
    updateData({ ...data, visits: updated });
    showToast('Consultation record removed', 'info');
  };

  // Prescription handlers
  const handleSavePrescription = (prescription: Prescription) => {
    const exists = data.prescriptions.some((r) => r.id === prescription.id);
    let updatedRx: Prescription[];
    if (exists) {
      updatedRx = data.prescriptions.map((r) => (r.id === prescription.id ? prescription : r));
      showToast('Prescription updated.', 'success');
    } else {
      updatedRx = [prescription, ...data.prescriptions];
      showToast('Prescription composed and saved.', 'success');
    }
    updateData({ ...data, prescriptions: updatedRx });
  };

  const handleDeletePrescription = (rxId: string) => {
    if (!window.confirm('Remove this prescription?')) return;
    const updated = data.prescriptions.filter((r) => r.id !== rxId);
    updateData({ ...data, prescriptions: updated });
    showToast('Prescription removed', 'info');
  };

  const handlePrintPrescription = (rxId: string) => {
    setPrintingRxId(rxId);
    setIsPrintRxOpen(true);
  };

  // Expense handlers
  const handleSaveExpense = (expense: Expense) => {
    const exists = data.expenses.some((e) => e.id === expense.id);
    let updatedExp: Expense[];
    if (exists) {
      updatedExp = data.expenses.map((e) => (e.id === expense.id ? expense : e));
      showToast('Expense updated.', 'success');
    } else {
      updatedExp = [expense, ...data.expenses];
      showToast('Practice expense logged.', 'success');
    }
    updateData({ ...data, expenses: updatedExp });
  };

  const handleDeleteExpense = (expId: string) => {
    if (!window.confirm('Delete this expense entry?')) return;
    const updated = data.expenses.filter((e) => e.id !== expId);
    updateData({ ...data, expenses: updated });
    showToast('Expense entry deleted', 'info');
  };

  // Collection handlers
  const handleSaveCollection = (collection: Collection) => {
    const exists = data.collections.some((c) => c.id === collection.id);
    let updatedColl: Collection[];
    if (exists) {
      updatedColl = data.collections.map((c) => (c.id === collection.id ? collection : c));
      showToast('Payment receipt updated.', 'success');
    } else {
      updatedColl = [collection, ...data.collections];
      showToast('Patient payment recorded.', 'success');
    }
    updateData({ ...data, collections: updatedColl });
  };

  const handleDeleteCollection = (colId: string) => {
    if (!window.confirm('Delete this payment record?')) return;
    const updated = data.collections.filter((c) => c.id !== colId);
    updateData({ ...data, collections: updated });
    showToast('Payment record deleted', 'info');
  };

  // Settings
  const handleSaveSettings = (settings: ClinicSettings) => {
    updateData({ ...data, settings });
    showToast('Clinic configuration saved.', 'success');
  };

  const handleResetDemoData = () => {
    const demo = getInitialDemoData();
    updateData(demo);
    showToast('Clinic demo data restored.', 'info');
  };

  // Next patient ID generator
  const getNextPatientId = () => {
    const maxNum = data.patients.reduce((max, p) => {
      const match = p.id.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 1000;
      return num > max ? num : max;
    }, 1000);
    return `LLC-${maxNum + 1}`;
  };

  // Selected patient for chart view
  const currentRecordPatient = data.patients.find((p) => p.id === selectedPatientIdForRecord) || null;
  const currentPrintRx = data.prescriptions.find((r) => r.id === printingRxId) || null;
  const currentPrintPatient = currentPrintRx
    ? data.patients.find((p) => p.id === currentPrintRx.patientId) || null
    : null;

  // Count summaries for sidebar badges
  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisitsCount = data.visits.filter((v) => v.date === todayStr).length;
  const pendingBillsCount = data.collections.filter((c) => c.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        settings={data.settings}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        counts={{
          patients: data.patients.length,
          todayVisits: todayVisitsCount,
          pendingBills: pendingBillsCount
        }}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewPatient={() => {
            setEditingPatient(null);
            setIsPatientModalOpen(true);
          }}
          onOpenNewVisit={(patientId) => {
            setEditingVisit(null);
            setPreSelectedPatientIdForVisit(patientId);
            setIsVisitModalOpen(true);
          }}
          onSelectPatient={(patientId) => {
            setSelectedPatientIdForRecord(patientId);
            setIsPatientRecordOpen(true);
          }}
          patients={data.patients}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <Dashboard
              data={data}
              onNavigate={setActivePage}
              onOpenNewPatient={() => {
                setEditingPatient(null);
                setIsPatientModalOpen(true);
              }}
              onOpenNewVisit={(patientId) => {
                setEditingVisit(null);
                setPreSelectedPatientIdForVisit(patientId);
                setIsVisitModalOpen(true);
              }}
              onOpenNewRx={() => {
                setEditingRx(null);
                setIsRxModalOpen(true);
              }}
              onSelectPatient={(patientId) => {
                setSelectedPatientIdForRecord(patientId);
                setIsPatientRecordOpen(true);
              }}
            />
          )}

          {activePage === 'patients' && (
            <PatientsView
              patients={data.patients}
              onOpenNewPatient={() => {
                setEditingPatient(null);
                setIsPatientModalOpen(true);
              }}
              onEditPatient={(patient) => {
                setEditingPatient(patient);
                setIsPatientModalOpen(true);
              }}
              onDeletePatient={handleDeletePatient}
              onSelectPatient={(patientId) => {
                setSelectedPatientIdForRecord(patientId);
                setIsPatientRecordOpen(true);
              }}
              onLogVisit={(patientId) => {
                setEditingVisit(null);
                setPreSelectedPatientIdForVisit(patientId);
                setIsVisitModalOpen(true);
              }}
              onExportExcel={() => {
                exportModuleToExcel('patients', data);
                showToast('Patients exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'visits' && (
            <VisitsView
              visits={data.visits}
              onOpenNewVisit={(patientId) => {
                setEditingVisit(null);
                setPreSelectedPatientIdForVisit(patientId);
                setIsVisitModalOpen(true);
              }}
              onEditVisit={(visit) => {
                setEditingVisit(visit);
                setIsVisitModalOpen(true);
              }}
              onDeleteVisit={handleDeleteVisit}
              onSelectPatient={(patientId) => {
                setSelectedPatientIdForRecord(patientId);
                setIsPatientRecordOpen(true);
              }}
              onExportExcel={() => {
                exportModuleToExcel('visits', data);
                showToast('Consultation visits exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'vitals' && (
            <VitalsTrackerView
              patients={data.patients}
              visits={data.visits}
              selectedPatientIdProp={vitalsPatientId}
              onExportExcel={() => {
                exportModuleToExcel('vitals', data);
                showToast('Vitals progression log exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'prescriptions' && (
            <PrescriptionsView
              prescriptions={data.prescriptions}
              onOpenNewRx={() => {
                setEditingRx(null);
                setIsRxModalOpen(true);
              }}
              onEditRx={(prescription) => {
                setEditingRx(prescription);
                setIsRxModalOpen(true);
              }}
              onDeleteRx={handleDeletePrescription}
              onPrintRx={handlePrintPrescription}
              onSelectPatient={(patientId) => {
                setSelectedPatientIdForRecord(patientId);
                setIsPatientRecordOpen(true);
              }}
              onExportExcel={() => {
                exportModuleToExcel('prescriptions', data);
                showToast('Prescriptions exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'expenses' && (
            <ExpensesView
              expenses={data.expenses}
              currency={data.settings.currency}
              onOpenNewExpense={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
              onExportExcel={() => {
                exportModuleToExcel('expenses', data);
                showToast('Expenses exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'collections' && (
            <CollectionsView
              collections={data.collections}
              currency={data.settings.currency}
              onOpenNewCollection={() => {
                setEditingCollection(null);
                setIsCollectionModalOpen(true);
              }}
              onDeleteCollection={handleDeleteCollection}
              onSelectPatient={(patientId) => {
                setSelectedPatientIdForRecord(patientId);
                setIsPatientRecordOpen(true);
              }}
              onExportExcel={() => {
                exportModuleToExcel('collections', data);
                showToast('Collections exported to Excel!', 'success');
              }}
            />
          )}

          {activePage === 'reports' && (
            <ReportsView data={data} currency={data.settings.currency} />
          )}

          {activePage === 'export' && (
            <ExportCenterView data={data} onShowToast={showToast} />
          )}

          {activePage === 'settings' && (
            <SettingsView
              settings={data.settings}
              onSaveSettings={handleSaveSettings}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        initialData={editingPatient}
        nextPatientId={getNextPatientId()}
      />

      <PatientRecordModal
        patient={currentRecordPatient}
        visits={data.visits}
        prescriptions={data.prescriptions}
        onClose={() => setIsPatientRecordOpen(false)}
        onLogVisit={(patId) => {
          setEditingVisit(null);
          setPreSelectedPatientIdForVisit(patId);
          setIsVisitModalOpen(true);
        }}
        onPrintPrescription={handlePrintPrescription}
      />

      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSave={handleSaveVisit}
        patients={data.patients}
        preSelectedPatientId={preSelectedPatientIdForVisit}
        initialData={editingVisit}
      />

      <PrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onSave={handleSavePrescription}
        patients={data.patients}
        defaultDoctorName={data.settings.doctorName}
        initialData={editingRx}
      />

      <PrintPrescriptionModal
        prescription={currentPrintRx}
        patient={currentPrintPatient}
        settings={data.settings}
        onClose={() => {
          setIsPrintRxOpen(false);
          setPrintingRxId(null);
        }}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        currency={data.settings.currency}
        initialData={editingExpense}
      />

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onSave={handleSaveCollection}
        patients={data.patients}
        currency={data.settings.currency}
        initialData={editingCollection}
      />
    </div>
  );
}
