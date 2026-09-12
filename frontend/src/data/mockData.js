// ===== Mock Data for Hospital Management System =====

export const DEPARTMENTS = [
  { id: 'dept-1', name: 'Cardiology', description: 'Heart and cardiovascular system', icon: '❤️', headDoctor: 'doc-1', totalDoctors: 8, color: '#ef4444' },
  { id: 'dept-2', name: 'Neurology', description: 'Brain and nervous system', icon: '🧠', headDoctor: 'doc-2', totalDoctors: 6, color: '#8b5cf6' },
  { id: 'dept-3', name: 'Orthopedics', description: 'Bones, joints and muscles', icon: '🦴', headDoctor: 'doc-3', totalDoctors: 7, color: '#3b82f6' },
  { id: 'dept-4', name: 'Pediatrics', description: 'Children and infant care', icon: '👶', headDoctor: 'doc-4', totalDoctors: 5, color: '#22c55e' },
  { id: 'dept-5', name: 'Dermatology', description: 'Skin, hair and nails', icon: '🧴', headDoctor: 'doc-5', totalDoctors: 4, color: '#f59e0b' },
  { id: 'dept-6', name: 'Ophthalmology', description: 'Eye care and vision', icon: '👁️', headDoctor: 'doc-6', totalDoctors: 3, color: '#14b8a6' },
  { id: 'dept-7', name: 'General Medicine', description: 'General health and wellness', icon: '🩺', headDoctor: 'doc-7', totalDoctors: 10, color: '#6366f1' },
  { id: 'dept-8', name: 'ENT', description: 'Ear, nose and throat', icon: '👂', headDoctor: 'doc-8', totalDoctors: 4, color: '#ec4899' },
];

export const DOCTORS = [
  { id: 'doc-1', userId: 'user-doc-1', name: 'Dr. Amit Sharma', email: 'amit.sharma@hospital.com', specialization: 'Cardiologist', department: 'Cardiology', departmentId: 'dept-1', experience: 15, phone: '+91 98765 43210', avatar: null, gender: 'Male', rating: 4.8, patientsHandled: 1250, status: 'active',
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Wednesday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'] },
    ]
  },
  { id: 'doc-2', userId: 'user-doc-2', name: 'Dr. Priya Patel', email: 'priya.patel@hospital.com', specialization: 'Neurologist', department: 'Neurology', departmentId: 'dept-2', experience: 12, phone: '+91 98765 43211', avatar: null, gender: 'Female', rating: 4.9, patientsHandled: 980, status: 'active',
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM'] },
      { day: 'Thursday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
    ]
  },
  { id: 'doc-3', userId: 'user-doc-3', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@hospital.com', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', departmentId: 'dept-3', experience: 20, phone: '+91 98765 43212', avatar: null, gender: 'Male', rating: 4.7, patientsHandled: 1560, status: 'active',
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'] },
    ]
  },
  { id: 'doc-4', userId: 'user-doc-4', name: 'Dr. Sneha Reddy', email: 'sneha.reddy@hospital.com', specialization: 'Pediatrician', department: 'Pediatrics', departmentId: 'dept-4', experience: 8, phone: '+91 98765 43213', avatar: null, gender: 'Female', rating: 4.9, patientsHandled: 720, status: 'active',
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Thursday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
    ]
  },
  { id: 'doc-5', userId: 'user-doc-5', name: 'Dr. Vikram Singh', email: 'vikram.singh@hospital.com', specialization: 'Dermatologist', department: 'Dermatology', departmentId: 'dept-5', experience: 10, phone: '+91 98765 43214', avatar: null, gender: 'Male', rating: 4.6, patientsHandled: 890, status: 'active',
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM'] },
    ]
  },
  { id: 'doc-6', userId: 'user-doc-6', name: 'Dr. Ananya Gupta', email: 'ananya.gupta@hospital.com', specialization: 'Ophthalmologist', department: 'Ophthalmology', departmentId: 'dept-6', experience: 7, phone: '+91 98765 43215', avatar: null, gender: 'Female', rating: 4.8, patientsHandled: 650, status: 'active',
    availability: [
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Friday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
    ]
  },
  { id: 'doc-7', userId: 'user-doc-7', name: 'Dr. Sanjay Verma', email: 'sanjay.verma@hospital.com', specialization: 'General Physician', department: 'General Medicine', departmentId: 'dept-7', experience: 18, phone: '+91 98765 43216', avatar: null, gender: 'Male', rating: 4.5, patientsHandled: 2100, status: 'active',
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
    ]
  },
  { id: 'doc-8', userId: 'user-doc-8', name: 'Dr. Meera Iyer', email: 'meera.iyer@hospital.com', specialization: 'ENT Specialist', department: 'ENT', departmentId: 'dept-8', experience: 11, phone: '+91 98765 43217', avatar: null, gender: 'Female', rating: 4.7, patientsHandled: 810, status: 'active',
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'] },
      { day: 'Tuesday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM'] },
    ]
  },
  { id: 'doc-9', userId: 'user-doc-9', name: 'Dr. Arjun Nair', email: 'arjun.nair@hospital.com', specialization: 'Cardiologist', department: 'Cardiology', departmentId: 'dept-1', experience: 6, phone: '+91 98765 43218', avatar: null, gender: 'Male', rating: 4.4, patientsHandled: 420, status: 'active',
    availability: [
      { day: 'Monday', slots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'] },
      { day: 'Friday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
    ]
  },
  { id: 'doc-10', userId: 'user-doc-10', name: 'Dr. Kavita Joshi', email: 'kavita.joshi@hospital.com', specialization: 'General Physician', department: 'General Medicine', departmentId: 'dept-7', experience: 14, phone: '+91 98765 43219', avatar: null, gender: 'Female', rating: 4.6, patientsHandled: 1890, status: 'on-leave',
    availability: [
      { day: 'Tuesday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
      { day: 'Thursday', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM'] },
    ]
  },
];

export const PATIENTS = [
  { id: 'pat-1', userId: 'user-pat-1', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', age: 32, gender: 'Male', bloodGroup: 'B+', phone: '+91 91234 56789', address: '42 MG Road, Mumbai', emergencyContact: '+91 91234 56780', registeredDate: '2025-01-15', status: 'active', avatar: null },
  { id: 'pat-2', userId: 'user-pat-2', name: 'Priyanka Desai', email: 'priyanka.d@email.com', age: 28, gender: 'Female', bloodGroup: 'A+', phone: '+91 91234 56790', address: '15 Park Street, Delhi', emergencyContact: '+91 91234 56791', registeredDate: '2025-02-20', status: 'active', avatar: null },
  { id: 'pat-3', userId: 'user-pat-3', name: 'Suresh Menon', email: 'suresh.m@email.com', age: 55, gender: 'Male', bloodGroup: 'O+', phone: '+91 91234 56792', address: '78 Lake View, Bangalore', emergencyContact: '+91 91234 56793', registeredDate: '2025-03-10', status: 'active', avatar: null },
  { id: 'pat-4', userId: 'user-pat-4', name: 'Anjali Kapoor', email: 'anjali.k@email.com', age: 42, gender: 'Female', bloodGroup: 'AB+', phone: '+91 91234 56794', address: '23 Residency Road, Pune', emergencyContact: '+91 91234 56795', registeredDate: '2025-03-22', status: 'active', avatar: null },
  { id: 'pat-5', userId: 'user-pat-5', name: 'Mohammad Ali', email: 'mohammad.a@email.com', age: 38, gender: 'Male', bloodGroup: 'B-', phone: '+91 91234 56796', address: '56 Civil Lines, Lucknow', emergencyContact: '+91 91234 56797', registeredDate: '2025-04-05', status: 'active', avatar: null },
  { id: 'pat-6', userId: 'user-pat-6', name: 'Deepa Krishnan', email: 'deepa.k@email.com', age: 65, gender: 'Female', bloodGroup: 'O-', phone: '+91 91234 56798', address: '12 Temple Road, Chennai', emergencyContact: '+91 91234 56799', registeredDate: '2025-04-18', status: 'active', avatar: null },
  { id: 'pat-7', userId: 'user-pat-7', name: 'Aryan Malhotra', email: 'aryan.m@email.com', age: 25, gender: 'Male', bloodGroup: 'A-', phone: '+91 91234 56800', address: '89 Green Park, Jaipur', emergencyContact: '+91 91234 56801', registeredDate: '2025-05-02', status: 'active', avatar: null },
  { id: 'pat-8', userId: 'user-pat-8', name: 'Nisha Agarwal', email: 'nisha.a@email.com', age: 48, gender: 'Female', bloodGroup: 'AB-', phone: '+91 91234 56802', address: '34 Jubilee Hills, Hyderabad', emergencyContact: '+91 91234 56803', registeredDate: '2025-05-15', status: 'active', avatar: null },
  { id: 'pat-9', userId: 'user-pat-9', name: 'Vikrant Choudhary', email: 'vikrant.c@email.com', age: 70, gender: 'Male', bloodGroup: 'O+', phone: '+91 91234 56804', address: '67 Sector 12, Chandigarh', emergencyContact: '+91 91234 56805', registeredDate: '2025-06-01', status: 'active', avatar: null },
  { id: 'pat-10', userId: 'user-pat-10', name: 'Tanvi Shah', email: 'tanvi.s@email.com', age: 22, gender: 'Female', bloodGroup: 'B+', phone: '+91 91234 56806', address: '45 CG Road, Ahmedabad', emergencyContact: '+91 91234 56807', registeredDate: '2025-06-20', status: 'active', avatar: null },
  { id: 'pat-11', userId: 'user-pat-11', name: 'Ravi Shankar', email: 'ravi.s@email.com', age: 58, gender: 'Male', bloodGroup: 'A+', phone: '+91 91234 56808', address: '90 MG Road, Kochi', emergencyContact: '+91 91234 56809', registeredDate: '2025-07-08', status: 'active', avatar: null },
  { id: 'pat-12', userId: 'user-pat-12', name: 'Sita Devi', email: 'sita.d@email.com', age: 75, gender: 'Female', bloodGroup: 'O+', phone: '+91 91234 56810', address: '11 Patna Road, Patna', emergencyContact: '+91 91234 56811', registeredDate: '2025-07-22', status: 'active', avatar: null },
];

export const APPOINTMENTS = [
  { id: 'apt-1', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-1', doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: '2026-09-04', time: '10:00 AM', status: 'confirmed', reason: 'Chest pain and shortness of breath', notes: '' },
  { id: 'apt-2', patientId: 'pat-2', patientName: 'Priyanka Desai', doctorId: 'doc-2', doctorName: 'Dr. Priya Patel', department: 'Neurology', date: '2026-09-04', time: '10:30 AM', status: 'confirmed', reason: 'Recurring headaches', notes: '' },
  { id: 'apt-3', patientId: 'pat-3', patientName: 'Suresh Menon', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-09-04', time: '09:00 AM', status: 'completed', reason: 'Regular checkup', notes: 'Patient is stable. Continue current medication.' },
  { id: 'apt-4', patientId: 'pat-4', patientName: 'Anjali Kapoor', doctorId: 'doc-3', doctorName: 'Dr. Rajesh Kumar', department: 'Orthopedics', date: '2026-09-04', time: '11:00 AM', status: 'confirmed', reason: 'Knee pain', notes: '' },
  { id: 'apt-5', patientId: 'pat-5', patientName: 'Mohammad Ali', doctorId: 'doc-5', doctorName: 'Dr. Vikram Singh', department: 'Dermatology', date: '2026-09-04', time: '10:00 AM', status: 'confirmed', reason: 'Skin rash', notes: '' },
  { id: 'apt-6', patientId: 'pat-6', patientName: 'Deepa Krishnan', doctorId: 'doc-1', doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: '2026-09-04', time: '11:00 AM', status: 'waiting', reason: 'Follow-up for hypertension', notes: '' },
  { id: 'apt-7', patientId: 'pat-7', patientName: 'Aryan Malhotra', doctorId: 'doc-4', doctorName: 'Dr. Sneha Reddy', department: 'Pediatrics', date: '2026-09-04', time: '09:30 AM', status: 'completed', reason: 'Vaccination', notes: 'All vaccinations given. Next visit in 3 months.' },
  { id: 'apt-8', patientId: 'pat-8', patientName: 'Nisha Agarwal', doctorId: 'doc-6', doctorName: 'Dr. Ananya Gupta', department: 'Ophthalmology', date: '2026-09-04', time: '10:00 AM', status: 'cancelled', reason: 'Eye checkup', notes: 'Patient cancelled due to emergency.' },
  { id: 'apt-9', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-09-05', time: '10:30 AM', status: 'confirmed', reason: 'Fever and cold', notes: '' },
  { id: 'apt-10', patientId: 'pat-9', patientName: 'Vikrant Choudhary', doctorId: 'doc-1', doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: '2026-09-05', time: '09:00 AM', status: 'confirmed', reason: 'Heart palpitations', notes: '' },
  { id: 'apt-11', patientId: 'pat-10', patientName: 'Tanvi Shah', doctorId: 'doc-8', doctorName: 'Dr. Meera Iyer', department: 'ENT', date: '2026-09-05', time: '09:30 AM', status: 'confirmed', reason: 'Sore throat', notes: '' },
  { id: 'apt-12', patientId: 'pat-2', patientName: 'Priyanka Desai', doctorId: 'doc-2', doctorName: 'Dr. Priya Patel', department: 'Neurology', date: '2026-09-06', time: '11:00 AM', status: 'confirmed', reason: 'Follow-up for migraine', notes: '' },
  // More past appointments
  { id: 'apt-13', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-08-05', time: '10:00 AM', status: 'completed', reason: 'Fever', notes: 'Prescribed paracetamol. Rest for 3 days.' },
  { id: 'apt-14', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-07-18', time: '11:00 AM', status: 'completed', reason: 'Headache', notes: 'Stress-related. Advised meditation and rest.' },
  { id: 'apt-15', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-06-12', time: '09:30 AM', status: 'completed', reason: 'Blood Test Follow-up', notes: 'All values normal.' },
  // Extra today appointments
  { id: 'apt-16', patientId: 'pat-11', patientName: 'Ravi Shankar', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', department: 'General Medicine', date: '2026-09-04', time: '10:00 AM', status: 'confirmed', reason: 'Joint pain', notes: '' },
  { id: 'apt-17', patientId: 'pat-12', patientName: 'Sita Devi', doctorId: 'doc-1', doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: '2026-09-04', time: '02:00 PM', status: 'confirmed', reason: 'Blood pressure monitoring', notes: '' },
];

export const PRESCRIPTIONS = [
  {
    id: 'presc-1', appointmentId: 'apt-13', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    date: '2026-08-05',
    medicines: [
      { name: 'Paracetamol', dose: '500mg', frequency: 'Twice a day', duration: '5 days' },
      { name: 'Cetirizine', dose: '10mg', frequency: 'Once at night', duration: '3 days' },
    ],
    instructions: 'Take medicine after meals. Drink plenty of water. Rest for 3 days.',
    followUpDate: '2026-08-15',
    diagnosis: 'Viral Fever'
  },
  {
    id: 'presc-2', appointmentId: 'apt-14', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    date: '2026-07-18',
    medicines: [
      { name: 'Ibuprofen', dose: '400mg', frequency: 'As needed', duration: '3 days' },
    ],
    instructions: 'Take when headache occurs. Do not exceed 3 tablets per day. Practice stress management.',
    followUpDate: '2026-08-05',
    diagnosis: 'Tension Headache'
  },
  {
    id: 'presc-3', appointmentId: 'apt-3', patientId: 'pat-3', patientName: 'Suresh Menon', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    date: '2026-09-04',
    medicines: [
      { name: 'Amlodipine', dose: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Metformin', dose: '500mg', frequency: 'Twice daily', duration: '30 days' },
      { name: 'Atorvastatin', dose: '10mg', frequency: 'Once at night', duration: '30 days' },
    ],
    instructions: 'Continue current medications. Monitor blood sugar daily. Low salt diet. Walk 30 minutes daily.',
    followUpDate: '2026-10-04',
    diagnosis: 'Hypertension & Type 2 Diabetes - Regular Follow-up'
  },
  {
    id: 'presc-4', appointmentId: 'apt-7', patientId: 'pat-7', patientName: 'Aryan Malhotra', doctorId: 'doc-4', doctorName: 'Dr. Sneha Reddy',
    date: '2026-09-04',
    medicines: [],
    instructions: 'All vaccinations administered. Monitor for any adverse reactions for 48 hours. Next vaccination due in 3 months.',
    followUpDate: '2026-12-04',
    diagnosis: 'Routine Vaccination'
  },
];

export const MEDICAL_RECORDS = [
  { id: 'mr-1', patientId: 'pat-1', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', date: '2026-08-05', diagnosis: 'Viral Fever', notes: 'Patient presented with high fever (102°F), body ache and fatigue. Throat slightly inflamed.', vitals: { bp: '120/80', temp: '102°F', pulse: '92', weight: '72 kg' }, prescriptionId: 'presc-1' },
  { id: 'mr-2', patientId: 'pat-1', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', date: '2026-07-18', diagnosis: 'Tension Headache', notes: 'Recurring headaches likely stress-related. No neurological symptoms. Advised lifestyle changes.', vitals: { bp: '130/85', temp: '98.4°F', pulse: '78', weight: '72 kg' }, prescriptionId: 'presc-2' },
  { id: 'mr-3', patientId: 'pat-1', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', date: '2026-06-12', diagnosis: 'Routine Blood Work Follow-up', notes: 'Blood test results normal. Hemoglobin, WBC, platelets all within range. Cholesterol slightly elevated.', vitals: { bp: '125/82', temp: '98.6°F', pulse: '74', weight: '73 kg' }, prescriptionId: null },
  { id: 'mr-4', patientId: 'pat-3', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma', date: '2026-09-04', diagnosis: 'Hypertension & Diabetes Follow-up', notes: 'Blood pressure controlled. Blood sugar levels within acceptable range. Continue medications.', vitals: { bp: '135/88', temp: '98.2°F', pulse: '76', weight: '80 kg' }, prescriptionId: 'presc-3' },
  { id: 'mr-5', patientId: 'pat-7', doctorId: 'doc-4', doctorName: 'Dr. Sneha Reddy', date: '2026-09-04', diagnosis: 'Routine Vaccination', notes: 'DPT booster and Hepatitis B administered. No immediate adverse reactions.', vitals: { bp: '115/75', temp: '98.6°F', pulse: '72', weight: '65 kg' }, prescriptionId: 'presc-4' },
];

export const LAB_REPORTS = [
  {
    id: 'lab-1', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    testName: 'Complete Blood Count (CBC)', requestDate: '2026-06-10', completedDate: '2026-06-11', status: 'completed',
    results: [
      { parameter: 'Hemoglobin', value: '13.5', unit: 'g/dL', normalRange: '13.0-17.0', status: 'normal' },
      { parameter: 'WBC', value: '7,200', unit: '/μL', normalRange: '4,500-11,000', status: 'normal' },
      { parameter: 'Platelets', value: '250,000', unit: '/μL', normalRange: '150,000-400,000', status: 'normal' },
      { parameter: 'RBC', value: '4.8', unit: 'million/μL', normalRange: '4.5-5.5', status: 'normal' },
    ]
  },
  {
    id: 'lab-2', patientId: 'pat-1', patientName: 'Rahul Sharma', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    testName: 'Lipid Profile', requestDate: '2026-06-10', completedDate: '2026-06-11', status: 'completed',
    results: [
      { parameter: 'Total Cholesterol', value: '215', unit: 'mg/dL', normalRange: '<200', status: 'high' },
      { parameter: 'HDL', value: '52', unit: 'mg/dL', normalRange: '>40', status: 'normal' },
      { parameter: 'LDL', value: '138', unit: 'mg/dL', normalRange: '<130', status: 'high' },
      { parameter: 'Triglycerides', value: '145', unit: 'mg/dL', normalRange: '<150', status: 'normal' },
    ]
  },
  {
    id: 'lab-3', patientId: 'pat-3', patientName: 'Suresh Menon', doctorId: 'doc-7', doctorName: 'Dr. Sanjay Verma',
    testName: 'Blood Sugar (Fasting)', requestDate: '2026-09-03', completedDate: '2026-09-04', status: 'completed',
    results: [
      { parameter: 'Fasting Blood Sugar', value: '118', unit: 'mg/dL', normalRange: '70-100', status: 'high' },
      { parameter: 'HbA1c', value: '6.8', unit: '%', normalRange: '<5.7', status: 'high' },
    ]
  },
  {
    id: 'lab-4', patientId: 'pat-2', patientName: 'Priyanka Desai', doctorId: 'doc-2', doctorName: 'Dr. Priya Patel',
    testName: 'MRI Brain', requestDate: '2026-09-04', completedDate: null, status: 'pending',
    results: []
  },
  {
    id: 'lab-5', patientId: 'pat-4', patientName: 'Anjali Kapoor', doctorId: 'doc-3', doctorName: 'Dr. Rajesh Kumar',
    testName: 'X-Ray Knee (Right)', requestDate: '2026-09-04', completedDate: null, status: 'in-progress',
    results: []
  },
  {
    id: 'lab-6', patientId: 'pat-9', patientName: 'Vikrant Choudhary', doctorId: 'doc-1', doctorName: 'Dr. Amit Sharma',
    testName: 'ECG', requestDate: '2026-09-03', completedDate: '2026-09-03', status: 'completed',
    results: [
      { parameter: 'Heart Rate', value: '78', unit: 'bpm', normalRange: '60-100', status: 'normal' },
      { parameter: 'PR Interval', value: '0.18', unit: 's', normalRange: '0.12-0.20', status: 'normal' },
      { parameter: 'QRS Duration', value: '0.09', unit: 's', normalRange: '0.06-0.10', status: 'normal' },
      { parameter: 'Interpretation', value: 'Normal Sinus Rhythm', unit: '', normalRange: '', status: 'normal' },
    ]
  },
];

export const BILLS = [
  {
    id: 'bill-1', patientId: 'pat-1', patientName: 'Rahul Sharma', date: '2026-08-05', status: 'paid', paymentMethod: 'UPI',
    items: [
      { description: 'Consultation - General Medicine', amount: 500 },
      { description: 'Blood Test - CBC', amount: 300 },
      { description: 'Blood Test - Lipid Profile', amount: 450 },
      { description: 'Medicine', amount: 280 },
    ],
    subtotal: 1530, discount: 0, tax: 0, total: 1530
  },
  {
    id: 'bill-2', patientId: 'pat-3', patientName: 'Suresh Menon', date: '2026-09-04', status: 'paid', paymentMethod: 'Card',
    items: [
      { description: 'Consultation - General Medicine', amount: 500 },
      { description: 'Blood Sugar Test (Fasting)', amount: 200 },
      { description: 'HbA1c Test', amount: 350 },
      { description: 'Medicine (30 days)', amount: 1200 },
    ],
    subtotal: 2250, discount: 225, tax: 0, total: 2025
  },
  {
    id: 'bill-3', patientId: 'pat-7', patientName: 'Aryan Malhotra', date: '2026-09-04', status: 'pending', paymentMethod: null,
    items: [
      { description: 'Consultation - Pediatrics', amount: 600 },
      { description: 'DPT Booster Vaccine', amount: 450 },
      { description: 'Hepatitis B Vaccine', amount: 350 },
    ],
    subtotal: 1400, discount: 0, tax: 0, total: 1400
  },
  {
    id: 'bill-4', patientId: 'pat-4', patientName: 'Anjali Kapoor', date: '2026-09-04', status: 'pending', paymentMethod: null,
    items: [
      { description: 'Consultation - Orthopedics', amount: 700 },
      { description: 'X-Ray Knee', amount: 500 },
    ],
    subtotal: 1200, discount: 0, tax: 0, total: 1200
  },
  {
    id: 'bill-5', patientId: 'pat-2', patientName: 'Priyanka Desai', date: '2026-09-04', status: 'pending', paymentMethod: null,
    items: [
      { description: 'Consultation - Neurology', amount: 800 },
      { description: 'MRI Brain', amount: 4500 },
    ],
    subtotal: 5300, discount: 530, tax: 0, total: 4770
  },
  {
    id: 'bill-6', patientId: 'pat-6', patientName: 'Deepa Krishnan', date: '2026-08-20', status: 'overdue', paymentMethod: null,
    items: [
      { description: 'Consultation - Cardiology', amount: 800 },
      { description: 'ECG', amount: 300 },
      { description: 'Echocardiogram', amount: 2500 },
      { description: 'Medicine (15 days)', amount: 680 },
    ],
    subtotal: 4280, discount: 0, tax: 0, total: 4280
  },
];

export const BEDS = [
  // General Ward
  { id: 'bed-1', number: '101', ward: 'General Ward', type: 'general', status: 'occupied', patientId: 'pat-3', patientName: 'Suresh Menon', admittedDate: '2026-09-01', dailyRate: 1500 },
  { id: 'bed-2', number: '102', ward: 'General Ward', type: 'general', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 1500 },
  { id: 'bed-3', number: '103', ward: 'General Ward', type: 'general', status: 'occupied', patientId: 'pat-9', patientName: 'Vikrant Choudhary', admittedDate: '2026-09-02', dailyRate: 1500 },
  { id: 'bed-4', number: '104', ward: 'General Ward', type: 'general', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 1500 },
  { id: 'bed-5', number: '105', ward: 'General Ward', type: 'general', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 1500 },
  { id: 'bed-6', number: '106', ward: 'General Ward', type: 'general', status: 'maintenance', patientId: null, patientName: null, admittedDate: null, dailyRate: 1500 },
  // ICU
  { id: 'bed-7', number: '201', ward: 'ICU', type: 'icu', status: 'occupied', patientId: 'pat-6', patientName: 'Deepa Krishnan', admittedDate: '2026-09-03', dailyRate: 5000 },
  { id: 'bed-8', number: '202', ward: 'ICU', type: 'icu', status: 'occupied', patientId: 'pat-11', patientName: 'Ravi Shankar', admittedDate: '2026-09-01', dailyRate: 5000 },
  { id: 'bed-9', number: '203', ward: 'ICU', type: 'icu', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 5000 },
  { id: 'bed-10', number: '204', ward: 'ICU', type: 'icu', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 5000 },
  // Private Room
  { id: 'bed-11', number: '301', ward: 'Private Room', type: 'private', status: 'occupied', patientId: 'pat-8', patientName: 'Nisha Agarwal', admittedDate: '2026-09-02', dailyRate: 3500 },
  { id: 'bed-12', number: '302', ward: 'Private Room', type: 'private', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 3500 },
  { id: 'bed-13', number: '303', ward: 'Private Room', type: 'private', status: 'available', patientId: null, patientName: null, admittedDate: null, dailyRate: 3500 },
  { id: 'bed-14', number: '304', ward: 'Private Room', type: 'private', status: 'occupied', patientId: 'pat-12', patientName: 'Sita Devi', admittedDate: '2026-09-03', dailyRate: 3500 },
];

// ===== Analytics / Chart Data =====
export const MONTHLY_PATIENTS = [
  { month: 'Jan', count: 65 }, { month: 'Feb', count: 78 }, { month: 'Mar', count: 92 },
  { month: 'Apr', count: 85 }, { month: 'May', count: 110 }, { month: 'Jun', count: 98 },
  { month: 'Jul', count: 120 }, { month: 'Aug', count: 105 }, { month: 'Sep', count: 42 },
];

export const MONTHLY_APPOINTMENTS = [
  { month: 'Jan', count: 180 }, { month: 'Feb', count: 210 }, { month: 'Mar', count: 245 },
  { month: 'Apr', count: 230 }, { month: 'May', count: 290 }, { month: 'Jun', count: 265 },
  { month: 'Jul', count: 310 }, { month: 'Aug', count: 285 }, { month: 'Sep', count: 120 },
];

export const MONTHLY_REVENUE = [
  { month: 'Jan', amount: 425000 }, { month: 'Feb', amount: 510000 }, { month: 'Mar', amount: 580000 },
  { month: 'Apr', amount: 545000 }, { month: 'May', amount: 680000 }, { month: 'Jun', amount: 620000 },
  { month: 'Jul', amount: 750000 }, { month: 'Aug', amount: 695000 }, { month: 'Sep', amount: 280000 },
];

export const DEPARTMENT_VISITS = [
  { name: 'General Medicine', visits: 320, color: '#6366f1' },
  { name: 'Cardiology', visits: 180, color: '#ef4444' },
  { name: 'Orthopedics', visits: 145, color: '#3b82f6' },
  { name: 'Neurology', visits: 120, color: '#8b5cf6' },
  { name: 'Pediatrics', visits: 95, color: '#22c55e' },
  { name: 'Dermatology', visits: 85, color: '#f59e0b' },
  { name: 'Ophthalmology', visits: 60, color: '#14b8a6' },
  { name: 'ENT', visits: 55, color: '#ec4899' },
];

// ===== Demo Login Credentials =====
export const DEMO_USERS = [
  { email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Admin User', id: 'user-admin-1' },
  { email: 'amit.sharma@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Amit Sharma', id: 'user-doc-1', doctorId: 'doc-1' },
  { email: 'priya.patel@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Priya Patel', id: 'user-doc-2', doctorId: 'doc-2' },
  { email: 'sanjay.verma@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Sanjay Verma', id: 'user-doc-7', doctorId: 'doc-7' },
  { email: 'reception@hospital.com', password: 'reception123', role: 'receptionist', name: 'Pooja Mehta', id: 'user-rec-1' },
  { email: 'rahul.sharma@email.com', password: 'patient123', role: 'patient', name: 'Rahul Sharma', id: 'user-pat-1', patientId: 'pat-1' },
  { email: 'priyanka.d@email.com', password: 'patient123', role: 'patient', name: 'Priyanka Desai', id: 'user-pat-2', patientId: 'pat-2' },
];

// ===== AI Symptom Assistant Data =====
export const SYMPTOM_RESPONSES = {
  fever: {
    info: 'Fever is a temporary increase in body temperature, often due to an illness. A fever shows that something unusual is going on in your body.',
    suggestions: ['Stay hydrated — drink water, clear broths, or electrolyte drinks', 'Rest and avoid strenuous activity', 'Monitor your temperature regularly', 'Use a light blanket if you have chills', 'Take a lukewarm bath to help cool down'],
    department: 'General Medicine',
    severity: 'mild',
  },
  headache: {
    info: 'Headaches are very common and most people experience them from time to time. They can range from mild discomfort to severe, debilitating pain.',
    suggestions: ['Rest in a quiet, dark room', 'Stay hydrated', 'Apply a cold or warm compress to your forehead', 'Practice relaxation techniques', 'Avoid screen time if possible'],
    department: 'Neurology',
    severity: 'mild',
  },
  'chest pain': {
    info: 'Chest pain can have many causes. While it should always be taken seriously, not all chest pain is related to the heart.',
    suggestions: ['Seek immediate medical attention if pain is severe, sudden, or accompanied by shortness of breath', 'Do not ignore chest pain, even if it seems mild', 'Note when the pain started, what you were doing, and any other symptoms', 'Avoid physical exertion until evaluated'],
    department: 'Cardiology',
    severity: 'high',
  },
  cough: {
    info: 'Coughing is a reflex that helps clear your airways. While usually not serious, a persistent cough may need medical attention.',
    suggestions: ['Stay hydrated with warm liquids', 'Honey and warm water may help soothe throat', 'Avoid irritants like smoke and dust', 'Use a humidifier if the air is dry', 'Consult a doctor if cough persists more than 2 weeks'],
    department: 'General Medicine',
    severity: 'mild',
  },
  'skin rash': {
    info: 'Skin rashes can be caused by many things, including allergies, infections, heat, and medications. Most rashes are not dangerous.',
    suggestions: ['Avoid scratching the affected area', 'Keep the area clean and dry', 'Apply a cool, damp cloth to the affected area', 'Wear loose-fitting clothing', 'Avoid known allergens or irritants'],
    department: 'Dermatology',
    severity: 'mild',
  },
  'joint pain': {
    info: 'Joint pain can affect one or many joints and can be caused by many types of conditions, including injury, inflammation, or wear and tear.',
    suggestions: ['Rest the affected joint', 'Apply ice packs to reduce swelling', 'Gentle stretching may help', 'Maintain a healthy weight to reduce joint stress', 'Consult a doctor if pain persists or worsens'],
    department: 'Orthopedics',
    severity: 'moderate',
  },
  'eye pain': {
    info: 'Eye pain can occur on the surface or deep within the eye. It may be caused by irritation, inflammation, or more serious conditions.',
    suggestions: ['Avoid rubbing your eyes', 'Rest your eyes from screens', 'Use artificial tears for dryness', 'Wear sunglasses in bright light', 'Seek immediate care if vision changes occur'],
    department: 'Ophthalmology',
    severity: 'moderate',
  },
  'sore throat': {
    info: 'A sore throat is pain, scratchiness, or irritation that often worsens when you swallow. Most sore throats are caused by viral infections.',
    suggestions: ['Gargle with warm salt water', 'Drink warm liquids like tea with honey', 'Rest your voice', 'Stay hydrated', 'Use throat lozenges for temporary relief'],
    department: 'ENT',
    severity: 'mild',
  },
  'stomach pain': {
    info: 'Stomach (abdominal) pain is common and can range from mild discomfort to severe pain. It can be caused by a wide variety of conditions.',
    suggestions: ['Avoid solid foods for a few hours', 'Sip clear fluids like water or ginger tea', 'Avoid spicy, fatty, or acidic foods', 'Use a heating pad on low setting', 'Seek immediate care if pain is severe or sudden'],
    department: 'General Medicine',
    severity: 'moderate',
  },
  'breathing difficulty': {
    info: 'Difficulty breathing (dyspnea) can be a sign of many different conditions. If it comes on suddenly or is severe, seek immediate medical attention.',
    suggestions: ['Sit upright to make breathing easier', 'Try to stay calm — anxiety can worsen breathlessness', 'Use pursed-lip breathing: inhale through nose, exhale slowly through pursed lips', 'Move to an area with fresh air', 'Seek emergency care if symptoms are severe'],
    department: 'General Medicine',
    severity: 'high',
  },
};

// ===== Notification Data =====
export const NOTIFICATIONS = [
  { id: 'notif-1', type: 'appointment', message: 'New appointment booked with Dr. Amit Sharma', time: '5 min ago', read: false },
  { id: 'notif-2', type: 'lab', message: 'Lab report for Suresh Menon is ready', time: '15 min ago', read: false },
  { id: 'notif-3', type: 'billing', message: 'Payment received from Suresh Menon - ₹2,025', time: '30 min ago', read: true },
  { id: 'notif-4', type: 'alert', message: 'Bed 106 marked for maintenance', time: '1 hr ago', read: true },
  { id: 'notif-5', type: 'appointment', message: 'Appointment cancelled by Nisha Agarwal', time: '2 hrs ago', read: true },
];
