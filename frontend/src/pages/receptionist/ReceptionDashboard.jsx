import { useState, useEffect } from 'react';

import {
  Card,
  StatCard,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  Toast,
  DataTable,
  Tabs
} from '../../components/ui';

import {
  UserPlus,
  CalendarPlus,
  Calendar,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

import jsPDF from 'jspdf';

const todayStr = new Date().toISOString().split('T')[0];

export default function ReceptionDashboard() {

  const [showRegister, setShowRegister] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showBill, setShowBill] = useState(false);

  // Real backend data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const [selectedBillPatient, setSelectedBillPatient] = useState('');

  const [toast, setToast] = useState(null);

  const [activeTab, setActiveTab] = useState('today');

  const [loading, setLoading] = useState(true);

  // Patient registration form
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
  });

  // Fetch all reception dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        patientsResponse,
        doctorsResponse,
        departmentsResponse,
        appointmentsResponse
      ] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/doctors'),
        fetch('/api/departments'),
        fetch('/api/appointments')
      ]);

      if (!patientsResponse.ok) {
        throw new Error('Failed to fetch patients');
      }

      if (!doctorsResponse.ok) {
        throw new Error('Failed to fetch doctors');
      }

      if (!departmentsResponse.ok) {
        throw new Error('Failed to fetch departments');
      }

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const patientsData = await patientsResponse.json();
      const doctorsData = await doctorsResponse.json();
      const departmentsData = await departmentsResponse.json();
      const appointmentsData = await appointmentsResponse.json();

      setPatients(
        Array.isArray(patientsData) ? patientsData : []
      );

      setDoctors(
        Array.isArray(doctorsData) ? doctorsData : []
      );

      setDepartments(
        Array.isArray(departmentsData) ? departmentsData : []
      );

      setAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : []
      );

    } catch (error) {

      console.error(
        'Error fetching reception dashboard data:',
        error
      );

      setToast({
        message: error.message || 'Failed to load dashboard data',
        type: 'error',
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle patient form changes
  const handlePatientChange = (e) => {
    const { name, value } = e.target;

    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Register patient in MongoDB
  const handleRegisterPatient = async () => {

    try {

      if (
        !patientForm.name ||
        !patientForm.email ||
        !patientForm.phone ||
        !patientForm.age ||
        !patientForm.gender ||
        !patientForm.bloodGroup ||
        !patientForm.address
      ) {

        setToast({
          message: 'Please fill all patient details',
          type: 'error',
        });

        return;
      }

      const response = await fetch('/api/patients', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: patientForm.name,
          email: patientForm.email,
          phone: patientForm.phone,
          age: Number(patientForm.age),
          gender: patientForm.gender,
          bloodGroup: patientForm.bloodGroup,
          address: patientForm.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to register patient'
        );
      }

      setShowRegister(false);

      setPatientForm({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        bloodGroup: '',
        address: '',
      });

      // Refresh patients
      await fetchDashboardData();

      setToast({
        message: 'Patient registered successfully',
        type: 'success',
      });

    } catch (error) {

      console.error(
        'Error registering patient:',
        error
      );

      setToast({
        message: error.message,
        type: 'error',
      });
    }
  };

  // Today's appointments
  const todayAppts = appointments.filter(
    (appointment) => appointment.date === todayStr
  );

  const waitingCount = todayAppts.filter(
    (appointment) => appointment.status === 'waiting'
  ).length;

  const confirmedCount = todayAppts.filter(
    (appointment) => appointment.status === 'confirmed'
  ).length;
  // Reception Dashboard Analytics
  const completedCount = appointments.filter(
    (appointment) => appointment.status === 'completed'
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === 'cancelled'
  ).length;

  const totalAppointments = appointments.length;

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === 'waiting' ||
      appointment.status === 'confirmed'
  ).length;

  const appointmentCompletionRate =
    totalAppointments > 0
      ? Math.round(
        (completedCount / totalAppointments) * 100
      )
      : 0;
  // Selected doctor
  const doctor = doctors.find(
    (doctorItem) =>
      doctorItem._id === selectedDoctor ||
      doctorItem.id === selectedDoctor
  );

  // Today's day
  const todayDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][new Date().getDay()];

  /*
    Your current Doctor model does not have an availability field.
    Therefore we use common appointment time slots for now.
    Later we can add doctor-specific availability to the backend.
  */
  const availableSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
  ];

  // Booked slots from real appointments
  const bookedSlots = appointments
    .filter(
      (appointment) =>
        (
          appointment.doctorId === selectedDoctor ||
          appointment.doctorId === doctor?._id
        ) &&
        appointment.date === selectedDate
    )
    .map((appointment) => appointment.time);

  // Book appointment
  const handleBookAppointment = async () => {

    try {

      if (!selectedPatient) {
        setToast({
          message: 'Please select a patient',
          type: 'error',
        });
        return;
      }

      if (!selectedDoctor) {
        setToast({
          message: 'Please select a doctor',
          type: 'error',
        });
        return;
      }

      if (!selectedDepartment) {
        setToast({
          message: 'Please select a department',
          type: 'error',
        });
        return;
      }

      if (!selectedDate) {
        setToast({
          message: 'Please select a date',
          type: 'error',
        });
        return;
      }

      if (!selectedTime) {
        setToast({
          message: 'Please select an available time slot',
          type: 'error',
        });
        return;
      }

      const patient = patients.find(
        (patientItem) =>
          patientItem._id === selectedPatient ||
          patientItem.id === selectedPatient
      );

      if (!patient) {
        throw new Error('Selected patient not found');
      }

      if (!doctor) {
        throw new Error('Selected doctor not found');
      }

      const appointmentData = {
        patientId: patient._id || patient.id || '',
        patientName: patient.name,

        doctorId: doctor._id || doctor.id || '',
        doctorName: doctor.name,

        department: selectedDepartment,

        date: selectedDate,
        time: selectedTime,

        reason: reason,

        status: 'confirmed',
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to book appointment'
        );
      }
      // Check-in patient
      const handleCheckIn = async (appointment) => {
        try {
          const response = await fetch(
            `/api/appointments/${appointment._id || appointment.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'waiting',
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || 'Failed to check in patient'
            );
          }

          // Update appointment immediately on the dashboard
          setAppointments((previous) =>
            previous.map((item) =>
              (item._id || item.id) ===
                (appointment._id || appointment.id)
                ? { ...item, status: 'waiting' }
                : item
            )
          );

          setToast({
            message: `${appointment.patientName} checked in successfully`,
            type: 'success',
          });

        } catch (error) {
          console.error('Error checking in patient:', error);

          setToast({
            message: error.message || 'Failed to check in patient',
            type: 'error',
          });
        }
      };
      // Close modal
      setShowBook(false);

      // Clear form
      setSelectedPatient('');
      setSelectedDepartment('');
      setSelectedDoctor('');
      setSelectedDate(todayStr);
      setSelectedTime('');
      setReason('');

      // Refresh appointments
      await fetchDashboardData();

      setToast({
        message: 'Appointment booked successfully!',
        type: 'success',
      });

    } catch (error) {

      console.error(
        'Error booking appointment:',
        error
      );

      setToast({
        message: error.message || 'Failed to book appointment',
        type: 'error',
      });
    }
  };

  // Tabs
  const tabs = [
    {
      id: 'today',
      label: "Today's",
      count: todayAppts.length
    },
    {
      id: 'checkin',
      label: 'Check-in',
      count: confirmedCount
    },
  ];

  // Appointment table
  const apptColumns = [

    {
      key: 'time',
      label: 'Time',
      sortable: true
    },

    {
      key: 'patientName',
      label: 'Patient',
      sortable: true
    },

    {
      key: 'doctorName',
      label: 'Doctor'
    },

    {
      key: 'reason',
      label: 'Reason',

      render: (value) => (
        <span className="truncate max-w-[150px] block text-sm">
          {value || '-'}
        </span>
      )
    },

    {
      key: 'status',
      label: 'Status',

      render: (value) => {

        const statusColors = {
          confirmed: 'primary',
          completed: 'success',
          waiting: 'warning',
          cancelled: 'danger'
        };

        return (
          <Badge
            variant={
              statusColors[value] || 'default'
            }
            dot
          >
            {value
              ? value.charAt(0).toUpperCase() +
              value.slice(1)
              : 'Unknown'}
          </Badge>
        );
      }
    },

    {
      key: 'actions',
      label: '',

      render: (_, row) =>
        row.status === 'confirmed' ? (

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCheckIn(row)}
          >
            Check In
          </Button>

        ) : null
    },
  ];

  // Generate bill PDF
  const generateBillPDF = () => {

    if (!selectedBillPatient) {

      setToast({
        message: 'Please select a patient',
        type: 'error'
      });

      return;
    }

    const patient = patients.find(
      (patientItem) =>
        patientItem._id === selectedBillPatient ||
        patientItem.id === selectedBillPatient
    );

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      'MediCare HMS - Invoice',
      20,
      20
    );

    doc.setFontSize(10);

    doc.text(
      `Date: ${new Date().toLocaleDateString('en-IN')}`,
      20,
      32
    );

    doc.text(
      `Patient: ${patient?.name || 'Patient'}`,
      20,
      39
    );

    doc.line(
      20,
      45,
      190,
      45
    );

    doc.text(
      'Consultation Fee',
      20,
      55
    );

    doc.text(
      '500',
      160,
      55
    );

    doc.line(
      20,
      60,
      190,
      60
    );

    doc.setFontSize(12);

    doc.text(
      'Total: Rs. 500',
      130,
      70
    );

    doc.save('bill.pdf');

    setShowBill(false);

    setSelectedBillPatient('');

    setToast({
      message: 'Bill PDF generated',
      type: 'success'
    });
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-[var(--text-secondary)]">
          Loading reception dashboard...
        </p>
      </div>
    );
  }

  return (

    <div
      id="reception-dashboard-page"
      className="space-y-6"
    >

      {/* Toast */}
      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Reception Desk
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            Manage patients, appointments, and billing
          </p>

        </div>

        <div className="flex gap-2">

          <Button
            icon={UserPlus}
            onClick={() => setShowRegister(true)}
          >
            Register Patient
          </Button>

          <Button
            icon={CalendarPlus}
            variant="secondary"
            onClick={() => setShowBook(true)}
          >
            Book Appointment
          </Button>

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Today's Appointments"
          value={todayAppts.length}
          icon={Calendar}
          color="primary"
          delay={0}
        />

        <StatCard
          title="Waiting"
          value={waitingCount}
          icon={Clock}
          color="warning"
          delay={100}
        />

        <StatCard
          title="Confirmed"
          value={confirmedCount}
          icon={CheckCircle}
          color="success"
          delay={200}
        />

        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="teal"
          delay={300}
        />

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {[
          {
            label: 'Register Patient',
            icon: UserPlus,
            color: 'bg-primary-500/10 text-primary-500',
            action: () => setShowRegister(true)
          },

          {
            label: 'Book Appointment',
            icon: CalendarPlus,
            color: 'bg-accent-500/10 text-accent-500',
            action: () => setShowBook(true)
          },

          {
            label: 'Generate Bill',
            icon: () => (
              <span className="text-lg">
                💰
              </span>
            ),
            color: 'bg-purple-500/10 text-purple-500',
            action: () => setShowBill(true)
          },

          {
            label: 'Check-in Patient',
            icon: CheckCircle,
            color: 'bg-teal-500/10 text-teal-500',
            action: () => setActiveTab('checkin')
          },

        ].map((item) => (

          <Card
            key={item.label}
            hover
            padding="p-4"
            className="cursor-pointer"
            onClick={item.action}
          >

            <div className="flex flex-col items-center gap-2 text-center">

              <div
                className={`p-3 rounded-xl ${item.color}`}
              >
                <item.icon size={24} />
              </div>

              <span className="text-sm font-medium text-[var(--text-primary)]">
                {item.label}
              </span>

            </div>

          </Card>

        ))}

      </div>
      {/* ============================= */}
      {/* RECEPTION ANALYTICS */}
      {/* ============================= */}

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Reception Analytics
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Overview of patients and appointments
            </p>
          </div>

          <div className="text-sm font-medium text-[var(--text-secondary)]">
            {appointmentCompletionRate}% completed
          </div>
        </div>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Appointments"
            value={totalAppointments}
            icon={Calendar}
            color="primary"
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={CheckCircle}
            color="success"
          />

          <StatCard
            title="Waiting / Confirmed"
            value={pendingCount}
            icon={Clock}
            color="warning"
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
            icon={Calendar}
            color="purple"
          />

        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Total Patients
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {patients.length}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Active Doctors
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {
                doctors.filter(
                  (doctor) => doctor.status === 'active'
                ).length
              }
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Departments
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {departments.length}
            </p>
          </div>

        </div>

        {/* Appointment Status Breakdown */}
        <div className="mt-6">

          <h4 className="font-semibold text-[var(--text-primary)] mb-3">
            Appointment Status
          </h4>

          <div className="space-y-3">

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">
                  Completed
                </span>

                <span className="font-medium text-[var(--text-primary)]">
                  {completedCount}
                </span>
              </div>

              <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${totalAppointments > 0
                      ? (completedCount /
                        totalAppointments) *
                      100
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">
                  Confirmed
                </span>

                <span className="font-medium text-[var(--text-primary)]">
                  {confirmedCount}
                </span>
              </div>

              <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${totalAppointments > 0
                      ? (confirmedCount /
                        totalAppointments) *
                      100
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">
                  Cancelled
                </span>

                <span className="font-medium text-[var(--text-primary)]">
                  {cancelledCount}
                </span>
              </div>

              <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${totalAppointments > 0
                      ? (cancelledCount /
                        totalAppointments) *
                      100
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </Card>
      {/* Appointments Table */}
      <Card>

        <div className="flex items-center justify-between mb-4">

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

        </div>

        <DataTable
          columns={apptColumns}
          data={
            activeTab === 'checkin'
              ? todayAppts.filter(
                (appointment) =>
                  appointment.status === 'confirmed'
              )
              : todayAppts
          }
        />

      </Card>

      {/* ============================= */}
      {/* REGISTER PATIENT MODAL */}
      {/* ============================= */}

      <Modal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        title="Register New Patient"
        size="lg"

        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowRegister(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleRegisterPatient}
            >
              Register
            </Button>
          </>
        }
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            label="Full Name"
            name="name"
            placeholder="Patient full name"
            value={patientForm.name}
            onChange={handlePatientChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="patient@email.com"
            value={patientForm.email}
            onChange={handlePatientChange}
            required
          />

          <Input
            label="Phone"
            name="phone"
            placeholder="+91 91234 56789"
            value={patientForm.phone}
            onChange={handlePatientChange}
            required
          />

          <Input
            label="Age"
            name="age"
            type="number"
            placeholder="25"
            value={patientForm.age}
            onChange={handlePatientChange}
            required
          />

          <Select
            label="Gender"
            name="gender"
            value={patientForm.gender}
            onChange={handlePatientChange}
            options={[
              {
                value: '',
                label: 'Select'
              },
              {
                value: 'Male',
                label: 'Male'
              },
              {
                value: 'Female',
                label: 'Female'
              },
              {
                value: 'Other',
                label: 'Other'
              },
            ]}
          />

          <Select
            label="Blood Group"
            name="bloodGroup"
            value={patientForm.bloodGroup}
            onChange={handlePatientChange}
            options={[
              {
                value: '',
                label: 'Select'
              },

              ...[
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-',
                'O+',
                'O-'
              ].map((value) => ({
                value,
                label: value
              })),

            ]}
          />

          <Input
            label="Address"
            name="address"
            placeholder="Full address"
            className="md:col-span-2"
            value={patientForm.address}
            onChange={handlePatientChange}
            required
          />

        </div>

      </Modal>

      {/* ============================= */}
      {/* BOOK APPOINTMENT MODAL */}
      {/* ============================= */}

      <Modal
        isOpen={showBook}
        onClose={() => setShowBook(false)}
        title="Book Appointment"
        size="lg"

        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowBook(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Patient */}
            <Select
              label="Patient"
              value={selectedPatient}
              onChange={(e) =>
                setSelectedPatient(e.target.value)
              }
              options={[
                {
                  value: '',
                  label: 'Select patient...'
                },

                ...patients.map((patientItem) => ({
                  value:
                    patientItem._id ||
                    patientItem.id,
                  label: patientItem.name
                })),

              ]}
            />

            {/* Department */}
            <Select
              label="Department"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);

                // Reset doctor when department changes
                setSelectedDoctor('');
                setSelectedTime('');
              }}
              options={[
                {
                  value: '',
                  label: 'Select department...'
                },

                ...departments.map((department) => ({
                  value: department.name,
                  label: department.name
                })),

              ]}
            />

            {/* Doctor */}
            <Select
              label="Doctor"
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setSelectedTime('');
              }}
              options={[
                {
                  value: '',
                  label: 'Select doctor...'
                },

                ...doctors
                  .filter(
                    (doctorItem) =>
                      doctorItem.status === 'active' &&
                      (
                        !selectedDepartment ||
                        doctorItem.department ===
                        selectedDepartment
                      )
                  )
                  .map((doctorItem) => ({
                    value:
                      doctorItem._id ||
                      doctorItem.id,
                    label:
                      `${doctorItem.name} — ${doctorItem.specialization}`
                  })),

              ]}
            />

            {/* Date */}
            <Input
              label="Date"
              type="date"
              value={selectedDate}
              min={todayStr}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
            />

            {/* Reason */}
            <Input
              label="Reason"
              placeholder="Reason for visit"
              className="md:col-span-2"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            />

          </div>

          {/* Slot Picker */}
          {selectedDoctor && (

            <div>

              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">

                Available Slots

              </label>

              {availableSlots.length > 0 ? (

                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">

                  {availableSlots.map((slot) => {

                    const isBooked =
                      bookedSlots.includes(slot);

                    const isSelected =
                      selectedTime === slot;

                    return (

                      <button
                        key={slot}
                        disabled={isBooked}

                        onClick={() =>
                          setSelectedTime(slot)
                        }

                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isBooked
                          ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-500 line-through cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary-500 text-white border border-primary-600'
                            : 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 hover:bg-accent-100 dark:hover:bg-accent-500/20 border border-accent-200 dark:border-accent-800'
                          }`}
                      >

                        {isBooked
                          ? '❌'
                          : isSelected
                            ? '✓'
                            : '✅'}{' '}

                        {slot}

                      </button>

                    );
                  })}

                </div>

              ) : (

                <p className="text-sm text-[var(--text-secondary)]">
                  No slots available.
                </p>

              )}

            </div>

          )}

        </div>

      </Modal>

      {/* ============================= */}
      {/* GENERATE BILL MODAL */}
      {/* ============================= */}

      <Modal
        isOpen={showBill}
        onClose={() => setShowBill(false)}
        title="Generate Bill"
        size="md"

        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowBill(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={generateBillPDF}
            >
              Generate PDF
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          <Select
            label="Patient"
            value={selectedBillPatient}
            onChange={(e) =>
              setSelectedBillPatient(e.target.value)
            }
            options={[
              {
                value: '',
                label: 'Select patient...'
              },

              ...patients.map((patientItem) => ({
                value:
                  patientItem._id ||
                  patientItem.id,
                label: patientItem.name
              })),

            ]}
          />

          <div className="space-y-2">

            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Bill Items
            </label>

            <div className="flex gap-2">

              <Input
                placeholder="Description"
                className="flex-1"
              />

              <Input
                placeholder="Amount"
                type="number"
                className="w-28"
              />

            </div>

            <div className="flex gap-2">

              <Input
                placeholder="Description"
                className="flex-1"
              />

              <Input
                placeholder="Amount"
                type="number"
                className="w-28"
              />

            </div>

            <Button
              variant="ghost"
              size="sm"
            >
              + Add Item
            </Button>

          </div>

          <Input
            label="Discount (%)"
            type="number"
            placeholder="0"
          />

        </div>

      </Modal>

    </div>
  );
}