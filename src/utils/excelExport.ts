import * as XLSX from 'xlsx';
import { ClinicData, Patient, DailyVisit, Prescription, Expense, Collection } from '../types/clinic';

export function exportFullMasterWorkbook(clinicData: ClinicData) {
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().split('T')[0];

  // 1. Patients Sheet
  const patientRows = clinicData.patients.map((p) => ({
    'Patient ID': p.id,
    'Registration Date': p.regDate,
    'Full Name': p.name,
    'Age': p.age,
    'Gender': p.gender,
    'Mobile Number': p.mobile,
    'Blood Group': p.bloodGroup,
    'Address': p.address,
    'Height (cm)': p.height || '',
    'Weight (kg)': p.weight || '',
    'Blood Pressure': p.bp || '',
    'Temperature (F)': p.temp || '',
    'Pulse (bpm)': p.pulse || '',
    'SpO2 (%)': p.spo2 || '',
    'Primary Complaint': p.complaint,
    'Allergies': p.allergies || 'None',
    'Medical History': p.history || '',
    'Clinical Notes': p.notes || ''
  }));
  const wsPatients = XLSX.utils.json_to_sheet(patientRows);
  XLSX.utils.book_append_sheet(wb, wsPatients, 'Patients');

  // 2. Daily Visits Sheet
  const visitRows = clinicData.visits.map((v) => ({
    'Visit ID': v.id,
    'Patient ID': v.patientId,
    'Patient Name': v.patientName,
    'Visit Date': v.date,
    'Weight (kg)': v.weight || '',
    'Blood Pressure': v.bp || '',
    'Temperature (F)': v.temp || '',
    'Pulse (bpm)': v.pulse || '',
    'SpO2 (%)': v.spo2 || '',
    'Complaint': v.complaint,
    'Diagnosis': v.diagnosis,
    'Follow-Up Date': v.followUp || 'As needed',
    'Doctor Notes': v.notes || ''
  }));
  const wsVisits = XLSX.utils.json_to_sheet(visitRows);
  XLSX.utils.book_append_sheet(wb, wsVisits, 'Daily Visits');

  // 3. Vital Records Progression Sheet
  const vitalsRows = clinicData.visits.map((v) => ({
    'Date': v.date,
    'Patient ID': v.patientId,
    'Patient Name': v.patientName,
    'Weight (kg)': v.weight || '',
    'Blood Pressure': v.bp || '',
    'Temperature (F)': v.temp || '',
    'Pulse (bpm)': v.pulse || '',
    'SpO2 (%)': v.spo2 || ''
  }));
  const wsVitals = XLSX.utils.json_to_sheet(vitalsRows);
  XLSX.utils.book_append_sheet(wb, wsVitals, 'Vital Records');

  // 4. Prescriptions Sheet
  const rxRows: any[] = [];
  clinicData.prescriptions.forEach((rx) => {
    rx.medicines.forEach((med, idx) => {
      rxRows.push({
        'Prescription ID': rx.id,
        'Date': rx.date,
        'Patient ID': rx.patientId,
        'Patient Name': rx.patientName,
        'Diagnosis': rx.diagnosis,
        'Item #': idx + 1,
        'Medicine Name': med.name,
        'Dosage': med.dosage,
        'Frequency': med.freq,
        'Duration': med.days,
        'Instructions': med.instructions,
        'Investigations Advised': rx.tests || 'None',
        'General Advice': rx.advice || '',
        'Next Follow-Up': rx.followUp || 'As needed',
        'Prescribing Doctor': rx.doctorName
      });
    });
  });
  const wsRx = XLSX.utils.json_to_sheet(rxRows);
  XLSX.utils.book_append_sheet(wb, wsRx, 'Prescriptions');

  // 5. Expenses Sheet
  const expenseRows = clinicData.expenses.map((e) => ({
    'Expense ID': e.id,
    'Date': e.date,
    'Category': e.category,
    'Description': e.description,
    'Amount': e.amount,
    'Payment Method': e.paymentMethod,
    'Notes': e.notes || ''
  }));
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

  // 6. Collections Sheet
  const collectionRows = clinicData.collections.map((c) => ({
    'Receipt ID': c.id,
    'Date': c.date,
    'Patient ID': c.patientId,
    'Patient Name': c.patientName,
    'Service / Treatment': c.service,
    'Amount': c.amount,
    'Payment Method': c.paymentMethod,
    'Status': c.status
  }));
  const wsCollections = XLSX.utils.json_to_sheet(collectionRows);
  XLSX.utils.book_append_sheet(wb, wsCollections, 'Collections');

  // 7. Executive Summary Sheet
  const totalCollections = clinicData.collections
    .filter((c) => c.status === 'Paid')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const totalExpenses = clinicData.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netIncome = totalCollections - totalExpenses;

  const summaryRows = [
    { 'Metric': 'Clinic Name', 'Value': clinicData.settings.clinicName },
    { 'Metric': 'Chief Doctor', 'Value': clinicData.settings.doctorName },
    { 'Metric': 'Report Generated On', 'Value': dateStr },
    { 'Metric': 'Total Registered Patients', 'Value': clinicData.patients.length },
    { 'Metric': 'Total Consultations Logged', 'Value': clinicData.visits.length },
    { 'Metric': 'Total Prescriptions Issued', 'Value': clinicData.prescriptions.length },
    { 'Metric': 'Total Gross Collections', 'Value': `${clinicData.settings.currency}${totalCollections.toFixed(2)}` },
    { 'Metric': 'Total Practice Expenses', 'Value': `${clinicData.settings.currency}${totalExpenses.toFixed(2)}` },
    { 'Metric': 'Net Practice Income', 'Value': `${clinicData.settings.currency}${netIncome.toFixed(2)}` }
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  const filename = `LifeLineClinic_MasterDatabase_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportModuleToExcel(
  moduleName: 'patients' | 'visits' | 'vitals' | 'prescriptions' | 'expenses' | 'collections',
  clinicData: ClinicData
) {
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().split('T')[0];
  let sheetName = '';
  let filename = '';

  switch (moduleName) {
    case 'patients': {
      const rows = clinicData.patients.map((p) => ({
        'Patient ID': p.id,
        'Registration Date': p.regDate,
        'Full Name': p.name,
        'Age': p.age,
        'Gender': p.gender,
        'Mobile': p.mobile,
        'Blood Group': p.bloodGroup,
        'Address': p.address,
        'Height (cm)': p.height || '',
        'Weight (kg)': p.weight || '',
        'Blood Pressure': p.bp || '',
        'Primary Complaint': p.complaint,
        'Allergies': p.allergies || 'None',
        'Medical History': p.history || ''
      }));
      sheetName = 'PATIENTS';
      filename = `LifeLineClinic_Patients_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
    case 'visits': {
      const rows = clinicData.visits.map((v) => ({
        'Visit ID': v.id,
        'Date': v.date,
        'Patient ID': v.patientId,
        'Patient Name': v.patientName,
        'Blood Pressure': v.bp || '',
        'Weight (kg)': v.weight || '',
        'Temperature (F)': v.temp || '',
        'Pulse': v.pulse || '',
        'SpO2 (%)': v.spo2 || '',
        'Complaint': v.complaint,
        'Diagnosis': v.diagnosis,
        'Follow-Up': v.followUp || '',
        'Notes': v.notes || ''
      }));
      sheetName = 'VISITS';
      filename = `LifeLineClinic_DailyVisits_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
    case 'vitals': {
      const rows = clinicData.visits.map((v) => ({
        'Date': v.date,
        'Patient': v.patientName,
        'Patient ID': v.patientId,
        'Blood Pressure': v.bp || '',
        'Weight (kg)': v.weight || '',
        'Pulse Rate (bpm)': v.pulse || '',
        'SpO2 (%)': v.spo2 || '',
        'Temperature (F)': v.temp || ''
      }));
      sheetName = 'VITALS_LOG';
      filename = `LifeLineClinic_VitalsLog_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
    case 'prescriptions': {
      const rows: any[] = [];
      clinicData.prescriptions.forEach((r) => {
        r.medicines.forEach((m) => {
          rows.push({
            'Rx ID': r.id,
            'Date': r.date,
            'Patient ID': r.patientId,
            'Patient Name': r.patientName,
            'Diagnosis': r.diagnosis,
            'Medicine Name': m.name,
            'Dosage': m.dosage,
            'Frequency': m.freq,
            'Duration': m.days,
            'Instructions': m.instructions,
            'Tests Advised': r.tests || '',
            'Follow-Up Date': r.followUp || '',
            'Doctor': r.doctorName
          });
        });
      });
      sheetName = 'PRESCRIPTIONS';
      filename = `LifeLineClinic_Prescriptions_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
    case 'expenses': {
      const rows = clinicData.expenses.map((e) => ({
        'Expense ID': e.id,
        'Date': e.date,
        'Category': e.category,
        'Description': e.description,
        'Amount': e.amount,
        'Payment Method': e.paymentMethod,
        'Notes': e.notes || ''
      }));
      sheetName = 'EXPENSES';
      filename = `LifeLineClinic_Expenses_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
    case 'collections': {
      const rows = clinicData.collections.map((c) => ({
        'Receipt ID': c.id,
        'Date': c.date,
        'Patient ID': c.patientId,
        'Patient Name': c.patientName,
        'Service / Treatment': c.service,
        'Amount': c.amount,
        'Payment Method': c.paymentMethod,
        'Status': c.status
      }));
      sheetName = 'COLLECTIONS';
      filename = `LifeLineClinic_Collections_${dateStr}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      break;
    }
  }

  XLSX.writeFile(wb, filename);
}
