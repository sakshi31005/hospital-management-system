import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  StatCard,
  Button,
  Badge,
  Avatar,
  Modal,
  Select,
  Input,
  Toast
} from '../../components/ui';
import {
  Calendar,
  ClipboardList,
  TestTube,
  Receipt,
  Clock,
  CalendarPlus
} from 'lucide-react';
import jsPDF from 'jspdf';

const todayStr = new Date().toISOString().split('T')[0];

export default function PatientDashboard() {
  const { user } = useAuth();

  const [showBook, setShowBook] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const [toast, setToast] = useState(null);
  const [viewPresc, setViewPresc] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [bills, setBills] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in patient's ID
  const patientId = user?.patientId;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        appointmentsRes,
        patientsRes,
        doctorsRes,
        departmentsRes,
        prescriptionsRes,
        labReportsRes,
        billsRes,
        bedsRes
      ] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
        fetch('/api/doctors'),
        fetch('/api/departments'),
        fetch('/api/prescriptions'),
        fetch('/api/lab-reports'),
        fetch('/api/bills'),
        fetch('/api/beds')
      ]);

      if (
        !appointmentsRes.ok ||
        !patientsRes.ok ||
        !doctorsRes.ok ||
        !departmentsRes.ok ||
        !prescriptionsRes.ok ||
        !labReportsRes.ok ||
        !billsRes.ok ||
        !bedsRes.ok
      ) {
        throw new Error('Failed to fetch dashboard data');
      }

      const appointmentsData = await appointmentsRes.json();
      const patientsData = await patientsRes.json();
      const doctorsData = await doctorsRes.json();
      const departmentsData = await departmentsRes.json();
      const prescriptionsData = await prescriptionsRes.json();
      const labReportsData = await labReportsRes.json();
      const billsData = await billsRes.json();
      const bedsData = await bedsRes.json();

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
      setPrescriptions(prescriptionsData);
      setLabReports(labReportsData);
      setBills(billsData);
      setBeds(bedsData);
    } catch (error) {
      console.error(
        'Error fetching patient dashboard:',
        error
      );

      setToast({
        message: 'Failed to load dashboard data',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Find logged-in patient
  const patient = patients.find(
    (p) =>
      p._id === patientId ||
      p.id === patientId
  );

  // Patient's appointments
  const myAppointments = appointments.filter(
    (appointment) =>
      appointment.patientId === patientId ||
      appointment.patientName === patient?.name
  );

  // Upcoming appointments
  const upcomingAppts = myAppointments.filter(
    (appointment) =>
      appointment.date >= todayStr &&
      appointment.status !== 'cancelled'
  );

  // Patient's prescriptions
  const myPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientId === patientId
  );

  const myLabReports = labReports.filter(
    (report) =>
      report.patientId === patientId ||
      report.patientId === patient?._id
  );

  const myBills = bills.filter(
    (bill) =>
      bill.patientId === patientId ||
      bill.patientId === patient?._id
  );

  const myBeds = beds.filter(
    (bed) =>
      bed.patientId === patientId ||
      bed.patientId === patient?._id
  );

  const myRecords = [];

  // Selected doctor
  const doctor = doctors.find(
    (d) =>
      d._id === selectedDoctor ||
      d.id === selectedDoctor
  );

  // Selected day
  const selectedDay = selectedDate
    ? [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ][
    new Date(
      `${selectedDate}T00:00:00`
    ).getDay()
    ]
    : '';

  // Your current Doctor model does not have availability.
  // Therefore no automatic slots are available yet.
  const availableSlots = [];

  // Already booked slots
  const bookedSlots = appointments
    .filter(
      (appointment) =>
        appointment.doctorId === selectedDoctor &&
        appointment.date === selectedDate
    )
    .map((appointment) => appointment.time);

  const statusColor = {
    confirmed: 'primary',
    completed: 'success',
    waiting: 'warning',
    cancelled: 'danger'
  };

  // Download prescription PDF
  const downloadPrescriptionPDF = (presc) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      'MediCare HMS - Prescription',
      20,
      20
    );

    doc.setFontSize(10);

    doc.text(
      `Doctor: ${presc.doctorName || ''}`,
      20,
      35
    );

    doc.text(
      `Patient: ${presc.patientName || patient?.name || ''}`,
      20,
      42
    );

    doc.text(
      `Date: ${new Date(
        presc.date
      ).toLocaleDateString('en-IN')}`,
      20,
      49
    );

    doc.text(
      `Diagnosis: ${presc.diagnosis || ''}`,
      20,
      56
    );

    doc.line(20, 62, 190, 62);

    let y = 72;

    const medicines =
      presc.medications ||
      presc.medicines ||
      [];

    medicines.forEach((medicine) => {
      doc.text(
        `${medicine.name || ''} - ${medicine.dosage ||
        medicine.dose ||
        ''
        } - ${medicine.frequency || ''} - ${medicine.duration || ''
        }`,
        20,
        y
      );

      y += 7;
    });

    y += 5;

    doc.text(
      `Instructions: ${presc.instructions || ''
      }`,
      20,
      y
    );

    y += 10;

    const followUp =
      presc.followUp ||
      presc.followUpDate;

    doc.text(
      `Follow-up: ${followUp
        ? new Date(
          followUp
        ).toLocaleDateString('en-IN')
        : 'As needed'
      }`,
      20,
      y
    );

    const prescriptionId =
      presc._id ||
      presc.id ||
      Date.now();

    doc.save(
      `prescription_${prescriptionId}.pdf`
    );

    setToast({
      message: 'Prescription downloaded',
      type: 'success'
    });
  };

  // Book appointment
  const handleConfirmBooking = async () => {
    try {
      if (
        !selectedDoctor ||
        !selectedDepartment ||
        !selectedDate ||
        !selectedTime
      ) {
        setToast({
          message:
            'Please select doctor, department, date and time',
          type: 'danger'
        });

        return;
      }

      const selectedDoctorData =
        doctors.find(
          (d) =>
            d._id === selectedDoctor ||
            d.id === selectedDoctor
        );

      const appointmentData = {
        patientId: patientId || '',
        patientName: patient?.name || '',
        doctorId: selectedDoctor,
        doctorName:
          selectedDoctorData?.name || '',
        department: selectedDepartment,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        status: 'confirmed'
      };

      const response = await fetch(
        '/api/appointments',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify(
            appointmentData
          )
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to book appointment'
        );
      }

      await fetchDashboardData();

      setShowBook(false);

      setSelectedDoctor('');
      setSelectedDepartment('');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');

      setToast({
        message:
          'Appointment booked successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error(
        'Booking error:',
        error
      );

      setToast({
        message: error.message,
        type: 'danger'
      });
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading patient dashboard...
        </p>
      </div>
    );
  }

  // Patient not found
  if (!patient) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Patient profile not found
            </h2>

            <p className="text-[var(--text-secondary)] mt-2">
              Your account is not linked to a
              patient profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      id="patient-dashboard-page"
      className="space-y-6"
    >
      {toast && (
        <Toast
          {...toast}
          onClose={() =>
            setToast(null)
          }
        />
      )}

      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            name={patient.name}
            size="xl"
          />

          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Hello,{' '}
              {patient.name.split(' ')[0]}! 👋
            </h1>

            <p className="text-[var(--text-secondary)] mt-1">
              Here's your health summary
            </p>
          </div>
        </div>

        <Button
          size="lg"
          icon={CalendarPlus}
          onClick={() =>
            setShowBook(true)
          }
        >
          Book Appointment
        </Button>
      </div>

      {/* Patient Info */}
      <Card
        padding="p-4"
        className="animate-fade-in-up"
      >
        <div className="flex flex-wrap gap-6">
          {[
            {
              label: 'Age',
              value: `${patient.age} years`
            },
            {
              label: 'Gender',
              value: patient.gender
            },
            {
              label: 'Blood Group',
              value: patient.bloodGroup
            },
            {
              label: 'Phone',
              value: patient.phone
            }
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-[var(--text-tertiary)]">
                {item.label}
              </p>

              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppts.length}
          icon={Calendar}
          color="primary"
          delay={0}
        />

        <StatCard
          title="Prescriptions"
          value={myPrescriptions.length}
          icon={ClipboardList}
          color="success"
          delay={100}
        />

        <StatCard
          title="Lab Reports"
          value={myLabReports.length}
          icon={TestTube}
          color="teal"
          delay={200}
        />

        <StatCard
          title="Pending Bills"
          value={
            myBills.filter(
              (bill) =>
                bill.status === 'pending'
            ).length
          }
          icon={Receipt}
          color="warning"
          delay={300}
        />
      </div>
      {/* Health Analytics */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '150ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          My Health Analytics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {/* Total Appointments */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Total Appointments
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {myAppointments.length}
            </p>
          </div>

          {/* Completed */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Completed
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {
                myAppointments.filter(
                  (apt) => apt.status === 'completed'
                ).length
              }
            </p>
          </div>

          {/* Upcoming */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Upcoming
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {upcomingAppts.length}
            </p>
          </div>

          {/* Prescriptions */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Prescriptions
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {myPrescriptions.length}
            </p>
          </div>

          {/* Lab Reports */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Lab Reports
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {myLabReports.length}
            </p>
          </div>

          {/* Pending Bills */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Pending Bills
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {
                myBills.filter(
                  (bill) => bill.status === 'pending'
                ).length
              }
            </p>
          </div>

        </div>
      </Card>
      {/* Upcoming Appointments */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '200ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Upcoming Appointments
        </h3>

        {upcomingAppts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)] mb-4">
              No upcoming appointments
            </p>

            <Button
              onClick={() =>
                setShowBook(true)
              }
            >
              Book Now
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppts.map(
              (apt) => (
                <div
                  key={
                    apt._id ||
                    apt.id
                  }
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-primary-500">
                      {new Date(
                        apt.date
                      ).getDate()}
                    </span>

                    <span className="text-xs text-primary-400">
                      {new Date(
                        apt.date
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          month: 'short'
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--text-primary)]">
                      {apt.doctorName}
                    </h4>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {apt.department} ·{' '}
                      {apt.reason}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {apt.time}
                    </p>

                    <Badge
                      variant={
                        statusColor[
                        apt.status
                        ] ||
                        'primary'
                      }
                      size="xs"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Card>

      {/* Prescriptions & Lab Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Prescriptions */}
        <Card
          className="animate-fade-in-up"
          style={{
            animationDelay: '300ms'
          }}
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Recent Prescriptions
          </h3>

          {myPrescriptions.length ===
            0 ? (
            <p className="text-sm text-[var(--text-secondary)]">
              No prescriptions yet
            </p>
          ) : (
            <div className="space-y-3">
              {myPrescriptions.map(
                (presc) => {
                  const medicines =
                    presc.medications ||
                    presc.medicines ||
                    [];

                  return (
                    <div
                      key={
                        presc._id ||
                        presc.id
                      }
                      className="p-3 rounded-lg bg-[var(--bg-tertiary)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[var(--text-primary)] text-sm">
                          {
                            presc.diagnosis
                          }
                        </h4>

                        <span className="text-xs text-[var(--text-secondary)]">
                          {new Date(
                            presc.date
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short'
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        {
                          presc.doctorName
                        }{' '}
                        ·{' '}
                        {
                          medicines.length
                        }{' '}
                        medicines
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setViewPresc(
                              presc
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            downloadPrescriptionPDF(
                              presc
                            )
                          }
                        >
                          📄 PDF
                        </Button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </Card>

        {/* Lab Reports */}
        <Card
          className="animate-fade-in-up"
          style={{
            animationDelay: '400ms'
          }}
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Lab Reports
          </h3>

          <p className="text-sm text-[var(--text-secondary)]">
            No lab reports available.
          </p>
        </Card>
      </div>

      {/* Medical History */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '500ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Medical History
        </h3>

        <p className="text-sm text-[var(--text-secondary)]">
          No medical records available.
        </p>
      </Card>

      {/* Bills */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '600ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          My Bills
        </h3>

        <p className="text-sm text-[var(--text-secondary)]">
          No bills available.
        </p>
      </Card>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={showBook}
        onClose={() =>
          setShowBook(false)
        }
        title="Book an Appointment"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setShowBook(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleConfirmBooking
              }
            >
              Confirm Booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">

          {/* Department */}
          <Select
            label="Department"
            value={
              selectedDepartment
            }
            onChange={(e) => {
              setSelectedDepartment(
                e.target.value
              );
              setSelectedDoctor('');
              setSelectedTime('');
            }}
            options={[
              {
                value: '',
                label:
                  'Select department'
              },
              ...departments.map(
                (department) => ({
                  value:
                    department.name,
                  label:
                    department.name
                })
              )
            ]}
          />

          {/* Doctor */}
          <Select
            label="Doctor"
            value={selectedDoctor}
            onChange={(e) => {
              setSelectedDoctor(
                e.target.value
              );
              setSelectedTime('');
            }}
            options={[
              {
                value: '',
                label:
                  'Select doctor'
              },

              ...doctors
                .filter(
                  (doctor) =>
                    doctor.status ===
                    'active' &&
                    (!selectedDepartment ||
                      doctor.department ===
                      selectedDepartment)
                )
                .map(
                  (doctor) => ({
                    value:
                      doctor._id,
                    label: `${doctor.name
                      } — ${doctor.specialization
                      } (⭐${doctor.rating ||
                      0
                      })`
                  })
                )
            ]}
          />

          {/* Date */}
          <Input
            label="Preferred Date"
            type="date"
            value={selectedDate}
            min={todayStr}
            onChange={(e) => {
              setSelectedDate(
                e.target.value
              );
              setSelectedTime('');
            }}
          />

          {/* Available Slots */}
          {selectedDoctor &&
            selectedDate && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Available Slots
                </label>

                {availableSlots.length ===
                  0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    No time slots configured
                    for this doctor yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {availableSlots.map(
                      (slot) => {
                        const booked =
                          bookedSlots.includes(
                            slot
                          );

                        return (
                          <button
                            key={`${selectedDate}-${slot}`}
                            type="button"
                            disabled={
                              booked
                            }
                            onClick={() => {
                              if (
                                !booked
                              ) {
                                setSelectedTime(
                                  slot
                                );
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${booked
                              ? 'bg-danger-50 text-danger-500 line-through cursor-not-allowed'
                              : selectedTime ===
                                slot
                                ? 'bg-primary-500 text-white'
                                : 'bg-accent-50 text-accent-600 hover:bg-accent-100'
                              }`}
                          >
                            {booked
                              ? '❌'
                              : selectedTime ===
                                slot
                                ? '🔵'
                                : '✅'}{' '}
                            {slot}
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}

          {/* Reason */}
          <Input
            label="Reason for Visit"
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
            placeholder="Describe your symptoms..."
          />

        </div>
      </Modal>

      {/* View Prescription Modal */}
      <Modal
        isOpen={!!viewPresc}
        onClose={() =>
          setViewPresc(null)
        }
        title="Prescription Details"
        size="md"
      >
        {viewPresc && (
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Doctor
                </p>

                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {
                    viewPresc.doctorName
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Date
                </p>

                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {new Date(
                    viewPresc.date
                  ).toLocaleDateString(
                    'en-IN'
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Diagnosis
                </p>

                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {
                    viewPresc.diagnosis
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Follow-up
                </p>

                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {(
                    viewPresc.followUp ||
                    viewPresc.followUpDate
                  )
                    ? new Date(
                      viewPresc.followUp ||
                      viewPresc.followUpDate
                    ).toLocaleDateString(
                      'en-IN'
                    )
                    : 'N/A'}
                </p>
              </div>

            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Medicines
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)]">
                      <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                        Medicine
                      </th>

                      <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                        Dose
                      </th>

                      <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                        Frequency
                      </th>

                      <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                        Duration
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(
                      viewPresc.medications ||
                      viewPresc.medicines ||
                      []
                    ).map(
                      (medicine, index) => (
                        <tr
                          key={
                            medicine._id ||
                            medicine.name ||
                            index
                          }
                          className="border-b border-[var(--border-light)]"
                        >
                          <td className="py-2 px-2 font-medium text-[var(--text-primary)]">
                            {
                              medicine.name
                            }
                          </td>

                          <td className="py-2 px-2 text-[var(--text-secondary)]">
                            {medicine.dosage ||
                              medicine.dose}
                          </td>

                          <td className="py-2 px-2 text-[var(--text-secondary)]">
                            {
                              medicine.frequency
                            }
                          </td>

                          <td className="py-2 px-2 text-[var(--text-secondary)]">
                            {
                              medicine.duration
                            }
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm text-[var(--text-primary)]">
              <p className="font-medium mb-1">
                Instructions:
              </p>

              <p>
                {
                  viewPresc.instructions
                }
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() =>
                downloadPrescriptionPDF(
                  viewPresc
                )
              }
            >
              📄 Download PDF
            </Button>

          </div>
        )}
      </Modal>
    </div>
  );
}