import { ClinicData } from '../types/clinic';

export const STORAGE_KEY = 'LIFE_LINE_CLINIC_STORE_V1';

export function getInitialDemoData(): ClinicData {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const lastWeekStr = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const twoWeeksAgoStr = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];
  const threeWeeksAgoStr = new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0];
  const thirtyDaysLaterStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const fiveDaysLaterStr = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  return {
    settings: {
      clinicName: 'Life Line Clinic',
      clinicSubtitle: 'Clinic Management & Patient Records System',
      clinicAddress: '104 Healthcare Boulevard, Medical Enclave',
      clinicPhone: '+1 (555) 345-6789 / info@lifelineclinic.med',
      doctorName: 'Dr. Robert Chen, MD',
      doctorDegrees: 'MBBS, MD (General Medicine)',
      doctorRegNo: 'MED-897412',
      currency: '$'
    },
    patients: [
      {
        id: 'LLC-1001',
        regDate: threeWeeksAgoStr,
        name: 'Eleanor Vance',
        age: 48,
        gender: 'Female',
        mobile: '555-019-2831',
        bloodGroup: 'B+',
        address: '742 Evergreen Terrace, Springfield',
        height: 165,
        weight: 68.0,
        bp: '130/82',
        temp: 98.4,
        pulse: 72,
        spo2: 99,
        complaint: 'Persistent migraine & occasional dizziness',
        allergies: 'Penicillin',
        history: 'Hypertension diagnosed 2021',
        notes: 'Advised lifestyle modification and reduced caffeine.'
      },
      {
        id: 'LLC-1002',
        regDate: twoWeeksAgoStr,
        name: 'Marcus Brody',
        age: 55,
        gender: 'Male',
        mobile: '555-492-8812',
        bloodGroup: 'O+',
        address: '12 West Lake Drive, Riverdale',
        height: 178,
        weight: 84.5,
        bp: '142/90',
        temp: 99.1,
        pulse: 82,
        spo2: 97,
        complaint: 'Joint pain in both knees and fatigue',
        allergies: 'Sulfa Drugs',
        history: 'Type 2 Diabetes Mellitus',
        notes: 'Prescribed anti-inflammatory regimen and joint gel.'
      },
      {
        id: 'LLC-1003',
        regDate: todayStr,
        name: 'Sophia Patel',
        age: 29,
        gender: 'Female',
        mobile: '555-781-9044',
        bloodGroup: 'A+',
        address: '88 Oakwood Court, Metro City',
        height: 160,
        weight: 56.0,
        bp: '118/75',
        temp: 101.4,
        pulse: 92,
        spo2: 98,
        complaint: 'High grade fever with productive cough',
        allergies: 'None',
        history: 'None declared',
        notes: 'Suspected acute viral throat infection.'
      },
      {
        id: 'LLC-1004',
        regDate: todayStr,
        name: 'David K. Miller',
        age: 62,
        gender: 'Male',
        mobile: '555-634-1190',
        bloodGroup: 'AB+',
        address: '405 Pine Valley Way, Hillcrest',
        height: 172,
        weight: 79.0,
        bp: '138/86',
        temp: 98.6,
        pulse: 76,
        spo2: 98,
        complaint: 'Routine cardiac health review and prescription refill',
        allergies: 'Aspirin (Mild Gastritis)',
        history: 'Coronary artery disease, stent placement in 2022',
        notes: 'ECG regular, cholesterol blood panel ordered.'
      }
    ],
    visits: [
      {
        id: 'VIS-501',
        patientId: 'LLC-1001',
        patientName: 'Eleanor Vance',
        date: threeWeeksAgoStr,
        weight: 69.5,
        bp: '142/90',
        temp: 98.6,
        pulse: 80,
        spo2: 98,
        complaint: 'Initial consultation for severe tension headache & high blood pressure',
        diagnosis: 'Stage 1 Essential Hypertension',
        followUp: twoWeeksAgoStr,
        notes: 'Initiated antihypertensive protocol. Salt restriction recommended.'
      },
      {
        id: 'VIS-502',
        patientId: 'LLC-1001',
        patientName: 'Eleanor Vance',
        date: twoWeeksAgoStr,
        weight: 68.8,
        bp: '136/86',
        temp: 98.4,
        pulse: 75,
        spo2: 99,
        complaint: 'BP follow-up check; slight headache persistency',
        diagnosis: 'Hypertension - Responding to treatment',
        followUp: todayStr,
        notes: 'Dose tolerated well, headache frequency decreased.'
      },
      {
        id: 'VIS-503',
        patientId: 'LLC-1001',
        patientName: 'Eleanor Vance',
        date: todayStr,
        weight: 68.0,
        bp: '130/82',
        temp: 98.4,
        pulse: 72,
        spo2: 99,
        complaint: 'BP check & maintenance review',
        diagnosis: 'Controlled Hypertension',
        followUp: thirtyDaysLaterStr,
        notes: 'BP normalized. Patient reports full symptom resolution.'
      },
      {
        id: 'VIS-504',
        patientId: 'LLC-1002',
        patientName: 'Marcus Brody',
        date: lastWeekStr,
        weight: 84.5,
        bp: '142/90',
        temp: 99.1,
        pulse: 82,
        spo2: 97,
        complaint: 'Bilateral knee stiffness, difficulty climbing stairs',
        diagnosis: 'Osteoarthritis with mild joint effusion',
        followUp: todayStr,
        notes: 'X-rays reviewed. Physical therapy advised.'
      },
      {
        id: 'VIS-505',
        patientId: 'LLC-1003',
        patientName: 'Sophia Patel',
        date: todayStr,
        weight: 56.0,
        bp: '118/75',
        temp: 101.4,
        pulse: 92,
        spo2: 98,
        complaint: 'Sudden fever, sore throat, chills for 48 hours',
        diagnosis: 'Acute Upper Respiratory Tract Infection',
        followUp: fiveDaysLaterStr,
        notes: 'Tonsillar erythema observed. Rapid strep negative. Hydration advised.'
      }
    ],
    prescriptions: [
      {
        id: 'RX-901',
        patientId: 'LLC-1001',
        patientName: 'Eleanor Vance',
        date: todayStr,
        diagnosis: 'Stage 1 Hypertension & Tension Headache',
        medicines: [
          {
            name: 'Amlodipine 5mg',
            dosage: '5 mg',
            freq: '1-0-0 (Morning)',
            days: '30 Days',
            instructions: 'Take after breakfast with water'
          },
          {
            name: 'Paracetamol 650mg',
            dosage: '650 mg',
            freq: 'SOS (As needed)',
            days: '5 Days',
            instructions: 'Take only if headache occurs (max 3/day)'
          }
        ],
        advice: 'Daily 30-min brisk walking. Dietary sodium < 2g per day. Maintain BP log.',
        tests: 'Lipid Profile, Serum Creatinine, Fasting Blood Sugar',
        followUp: thirtyDaysLaterStr,
        doctorName: 'Dr. Robert Chen, MD'
      },
      {
        id: 'RX-902',
        patientId: 'LLC-1003',
        patientName: 'Sophia Patel',
        date: todayStr,
        diagnosis: 'Acute Upper Respiratory Tract Infection',
        medicines: [
          {
            name: 'Amoxicillin-Clav 625mg',
            dosage: '625 mg',
            freq: '1-0-1 (BD)',
            days: '5 Days',
            instructions: 'Take after meals'
          },
          {
            name: 'Paracetamol 500mg',
            dosage: '500 mg',
            freq: '1-1-1 (TID)',
            days: '3 Days',
            instructions: 'Take after food for fever/body aches'
          },
          {
            name: 'Cetirizine 10mg',
            dosage: '10 mg',
            freq: '0-0-1 (Night)',
            days: '5 Days',
            instructions: 'Take before sleeping'
          }
        ],
        advice: 'Steam inhalation twice daily. Drink warm saline gargles. Rest adequately.',
        tests: 'CBC if fever does not subside within 72 hours',
        followUp: fiveDaysLaterStr,
        doctorName: 'Dr. Robert Chen, MD'
      }
    ],
    expenses: [
      {
        id: 'EXP-301',
        date: todayStr,
        category: 'Medical Supplies',
        description: 'Sterile surgical gloves, syringes, and gauze rolls',
        amount: 145.0,
        paymentMethod: 'Cash',
        notes: 'MediWholesale bill ref #MW-9912'
      },
      {
        id: 'EXP-302',
        date: todayStr,
        category: 'Electricity',
        description: 'Monthly clinic electricity & AC consumption',
        amount: 210.0,
        paymentMethod: 'UPI',
        notes: 'Online auto-pay transaction'
      },
      {
        id: 'EXP-303',
        date: lastWeekStr,
        category: 'Medicine Purchase',
        description: 'Clinic emergency medication restocking & nebulizer liquids',
        amount: 680.0,
        paymentMethod: 'Bank Transfer',
        notes: 'Pharma supply batch #21'
      },
      {
        id: 'EXP-304',
        date: twoWeeksAgoStr,
        category: 'Maintenance',
        description: 'Autoclave machine servicing & calibration',
        amount: 120.0,
        paymentMethod: 'Cash',
        notes: 'Service engineer receipt #442'
      }
    ],
    collections: [
      {
        id: 'COL-701',
        date: todayStr,
        patientId: 'LLC-1001',
        patientName: 'Eleanor Vance',
        service: 'Follow-up Consultation + BP Check',
        amount: 50.0,
        paymentMethod: 'UPI',
        status: 'Paid'
      },
      {
        id: 'COL-702',
        date: todayStr,
        patientId: 'LLC-1003',
        patientName: 'Sophia Patel',
        service: 'Urgent Care Consultation & Nebulization',
        amount: 90.0,
        paymentMethod: 'Cash',
        status: 'Paid'
      },
      {
        id: 'COL-703',
        date: lastWeekStr,
        patientId: 'LLC-1002',
        patientName: 'Marcus Brody',
        service: 'Orthopedic Evaluation & Joint Assessment',
        amount: 85.0,
        paymentMethod: 'Card',
        status: 'Paid'
      },
      {
        id: 'COL-704',
        date: todayStr,
        patientId: 'LLC-1004',
        patientName: 'David K. Miller',
        service: 'Cardiac Wellness Follow-Up & ECG',
        amount: 120.0,
        paymentMethod: 'Card',
        status: 'Paid'
      }
    ]
  };
}

export function loadClinicData(): ClinicData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDemoData();
      saveClinicData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.settings || !Array.isArray(parsed.patients)) {
      throw new Error('Corrupted data structure');
    }
    return parsed;
  } catch (err) {
    console.error('Error loading clinic data from localStorage:', err);
    const initial = getInitialDemoData();
    saveClinicData(initial);
    return initial;
  }
}

export function saveClinicData(data: ClinicData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving clinic data to localStorage:', err);
  }
}
