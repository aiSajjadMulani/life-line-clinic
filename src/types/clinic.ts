export interface ClinicSettings {
  clinicName: string;
  clinicSubtitle: string;
  clinicAddress: string;
  clinicPhone: string;
  doctorName: string;
  doctorDegrees: string;
  doctorRegNo: string;
  currency: string;
}

export interface Patient {
  id: string; // e.g. LLC-1001
  regDate: string; // YYYY-MM-DD
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  bloodGroup: string;
  address: string;
  height?: number | string;
  weight?: number | string;
  bp?: string;
  temp?: number | string;
  pulse?: number | string;
  spo2?: number | string;
  complaint: string;
  allergies?: string;
  history?: string;
  notes?: string;
}

export interface DailyVisit {
  id: string; // e.g. VIS-501
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  weight?: number | string;
  bp?: string;
  temp?: number | string;
  pulse?: number | string;
  spo2?: number | string;
  complaint: string;
  diagnosis: string;
  followUp?: string;
  notes?: string;
}

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  freq: string;
  days: string;
  instructions: string;
}

export interface Prescription {
  id: string; // e.g. RX-901
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  advice?: string;
  tests?: string;
  followUp?: string;
  doctorName: string;
}

export type ExpenseCategory =
  | 'Medicine Purchase'
  | 'Electricity'
  | 'Rent'
  | 'Staff Salary'
  | 'Medical Supplies'
  | 'Maintenance'
  | 'Other';

export interface Expense {
  id: string; // e.g. EXP-301
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Cheque';
  notes?: string;
}

export interface Collection {
  id: string; // e.g. COL-701
  date: string;
  patientId: string;
  patientName: string;
  service: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  status: 'Paid' | 'Pending';
}

export interface ClinicData {
  settings: ClinicSettings;
  patients: Patient[];
  visits: DailyVisit[];
  prescriptions: Prescription[];
  expenses: Expense[];
  collections: Collection[];
}

export type ActivePage =
  | 'dashboard'
  | 'patients'
  | 'visits'
  | 'vitals'
  | 'prescriptions'
  | 'expenses'
  | 'collections'
  | 'reports'
  | 'export'
  | 'settings';
