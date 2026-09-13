import { apiUrl } from "../../Api/Api";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  StatCard,
  Badge,
  Button,
  Avatar,
  Modal,
  Input,
  Textarea,
  Toast
} from '../../components/ui';
import {
  Calendar,
  Users,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  Plus,
  Star
} from 'lucide-react';
import jsPDF from 'jspdf';

const todayStr = new Date().toISOString().split('T')[0];

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState(null);

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  // Prescription form state
  const [prescForm, setPrescForm] = useState({
    medicines: [
      {
        name: '',
        dose: '',
        frequency: '',
        duration: ''
      }
    ],
    instructions: '',
    followUp: '',
    diagnosis: ''
  });

  // Fetch doctor dashboard data
  const fetchDoctorData = async () => {
    try {
      setLoading(true);

      const [
        doctorsRes,
        appointmentsRes,
        patientsRes,
        prescriptionsRes,
        labReportsRes
      ] = await Promise.all([
        fetch(apiUrl('/api/doctors')),
        fetch(apiUrl('/api/appointments')),
        fetch(apiUrl('/api/patients')),
        fetch(apiUrl('/api/prescriptions')),
        fetch(apiUrl('/api/lab-reports'))
      ]);

      if (
        !doctorsRes.ok ||
        !appointmentsRes.ok ||
        !patientsRes.ok ||
        !prescriptionsRes.ok ||
        !labReportsRes.ok
      ) {
        throw new Error('Failed to fetch dashboard data');
      }

      const doctorsData = await doctorsRes.json();
      const appointmentsData = await appointmentsRes.json();
      const patientsData = await patientsRes.json();
      const prescriptionsData = await prescriptionsRes.json();
      const labReportsData = await labReportsRes.json();

      // Find logged-in doctor's record
      const currentDoctor = doctorsData.find(
        (d) =>
          d._id === user?.doctorId ||
          d.id === user?.doctorId
      );

      setDoctor(currentDoctor || null);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setPrescriptions(prescriptionsData);
      setLabReports(labReportsData);
    } catch (error) {
      console.error('Error fetching doctor dashboard:', error);

      setToast({
        message: 'Failed to load dashboard data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.doctorId) {
      fetchDoctorData();
    }
  }, [user?.doctorId]);

  // Get this doctor's appointments
  const myAppointments = appointments.filter(
    (appointment) =>
      appointment.doctorId === user?.doctorId ||
      appointment.doctorId === doctor?._id
  );

  // Today's appointments
  const todayAppts = myAppointments.filter(
    (appointment) => appointment.date === todayStr
  );

  // Completed appointments today
  const completedToday = todayAppts.filter(
    (appointment) => appointment.status === 'completed'
  ).length;

  // This doctor's prescriptions
  const myPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.doctorId === user?.doctorId ||
      prescription.doctorId === doctor?._id
  );

  // Unique patients handled by this doctor
  const totalPatients = new Set(
    myAppointments
      .map((appointment) => appointment.patientId)
      .filter(Boolean)
  ).size;

  // Appointment analytics
  const confirmedAppointments = myAppointments.filter(
    (appointment) => appointment.status === 'confirmed'
  ).length;

  const completedAppointments = myAppointments.filter(
    (appointment) => appointment.status === 'completed'
  ).length;

  const pendingAppointments = myAppointments.filter(
    (appointment) => appointment.status === 'pending' ||
      appointment.status === 'waiting'
  ).length;

  const cancelledAppointments = myAppointments.filter(
    (appointment) => appointment.status === 'cancelled'
  ).length;

  // This doctor's lab reports
  const myLabReports = labReports.filter(
    (report) =>
      report.doctorId === user?.doctorId ||
      report.doctorId === doctor?._id
  );

  // Add medicine row
  const addMedicine = () => {
    setPrescForm((previous) => ({
      ...previous,
      medicines: [
        ...previous.medicines,
        {
          name: '',
          dose: '',
          frequency: '',
          duration: ''
        }
      ]
    }));
  };

  // Update medicine field
  const updateMedicine = (index, field, value) => {
    setPrescForm((previous) => {
      const medicines = [...previous.medicines];

      medicines[index] = {
        ...medicines[index],
        [field]: value
      };

      return {
        ...previous,
        medicines
      };
    });
  };

  // View patient history
  const viewPatientHistory = (patientId) => {
    const patient = patients.find(
      (p) =>
        p._id === patientId ||
        p.id === patientId
    );

    setSelectedPatient(patient || null);
    setShowHistory(true);
  };

  // SAVE PRESCRIPTION TO MONGODB
  const handleSavePrescription = async () => {
    if (!selectedAppointment) {
      setToast({
        message: 'No appointment selected',
        type: 'error'
      });
      return;
    }

    if (!prescForm.diagnosis.trim()) {
      setToast({
        message: 'Please enter a diagnosis',
        type: 'error'
      });
      return;
    }

    const validMedicines = prescForm.medicines.filter(
      (medicine) =>
        medicine.name.trim() &&
        medicine.dose.trim() &&
        medicine.frequency.trim() &&
        medicine.duration.trim()
    );

    if (validMedicines.length === 0) {
      setToast({
        message: 'Please add at least one complete medicine',
        type: 'error'
      });
      return;
    }

    const prescriptionData = {
      doctorId: user?.doctorId || doctor?._id,
      patientId: selectedAppointment.patientId,
      appointmentId: selectedAppointment._id,
      diagnosis: prescForm.diagnosis,

      medications: validMedicines.map((medicine) => ({
        name: medicine.name,
        dosage: medicine.dose,
        frequency: medicine.frequency,
        duration: medicine.duration
      })),

      instructions: prescForm.instructions,
      followUp: prescForm.followUp || undefined
    };

    try {
      const response = await fetch(apiUrl('/api/prescriptions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescriptionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create prescription'
        );
      }

      // Add newly created prescription to dashboard
      setPrescriptions((previous) => [
        data,
        ...previous
      ]);

      // Reset form
      setPrescForm({
        medicines: [
          {
            name: '',
            dose: '',
            frequency: '',
            duration: ''
          }
        ],
        instructions: '',
        followUp: '',
        diagnosis: ''
      });

      setSelectedAppointment(null);
      setShowPrescription(false);

      setToast({
        message: 'Prescription created successfully ðŸ’Š',
        type: 'success'
      });
    } catch (error) {
      console.error(
        'Error creating prescription:',
        error
      );

      setToast({
        message: error.message,
        type: 'error'
      });
    }
  };

  // Generate prescription PDF
  const generatePrescriptionPDF = (presc) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('MediCare HMS - Prescription', 20, 20);

    doc.setFontSize(10);

    doc.text(
      `Doctor: ${presc.doctorName || doctor?.name || ''}`,
      20,
      35
    );

    doc.text(
      `Patient: ${presc.patientName || ''}`,
      20,
      42
    );

    doc.text(
      `Date: ${new Date(presc.date).toLocaleDateString('en-IN')}`,
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

    doc.setFontSize(11);

    doc.text('Medicine', 20, y);
    doc.text('Dose', 80, y);
    doc.text('Frequency', 110, y);
    doc.text('Duration', 155, y);

    y += 8;

    doc.setFontSize(10);

    const medicines =
      presc.medications ||
      presc.medicines ||
      [];

    medicines.forEach((medicine) => {
      doc.text(medicine.name || '', 20, y);

      doc.text(
        medicine.dosage ||
        medicine.dose ||
        '',
        80,
        y
      );

      doc.text(
        medicine.frequency || '',
        110,
        y
      );

      doc.text(
        medicine.duration || '',
        155,
        y
      );

      y += 7;
    });

    y += 5;

    doc.text(
      `Instructions: ${presc.instructions || ''}`,
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
      message: 'Prescription PDF downloaded',
      type: 'success'
    });
  };

  // Medical records API is not created yet
  const patientRecords = [];

  const statusColor = {
    confirmed: 'primary',
    completed: 'success',
    waiting: 'warning',
    cancelled: 'danger'
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading doctor dashboard...
        </p>
      </div>
    );
  }

  // Doctor not found
  if (!doctor) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="py-10 text-center">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Doctor profile not found
            </h2>

            <p className="text-[var(--text-secondary)] mt-2">
              Your account is not linked to a doctor profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      id="doctor-dashboard-page"
      className="space-y-6"
    >
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
            Welcome, {doctor.name}
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            {doctor.specialization} Â· {doctor.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Star
            size={16}
            className="text-warning-400"
          />

          <span className="text-sm font-medium text-[var(--text-primary)]">
            {doctor.rating || 0} rating
          </span>

          <span className="text-[var(--text-tertiary)]">
            Â·
          </span>

          <span className="text-sm text-[var(--text-secondary)]">
            {totalPatients} patients handled
          </span>
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
          title="Completed Today"
          value={completedToday}
          icon={ClipboardList}
          color="success"
          delay={100}
        />

        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          color="teal"
          delay={200}
        />

        <StatCard
          title="Prescriptions"
          value={myPrescriptions.length}
          icon={FileText}
          color="purple"
          delay={300}
        />
      </div>

      {/* Today's Appointments */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '200ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Today's Appointments
        </h3>

        {todayAppts.length === 0 ? (
          <p className="text-[var(--text-secondary)] py-8 text-center">
            No appointments for today
          </p>
        ) : (
          <div className="space-y-3">
            {todayAppts.map((apt, i) => {
              const patient = patients.find(
                (p) =>
                  p._id === apt.patientId ||
                  p.id === apt.patientId
              );

              return (
                <div
                  key={apt._id || apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 80}ms`
                  }}
                >
                  <Avatar
                    name={apt.patientName}
                    size="lg"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {apt.patientName}
                      </h4>

                      <Badge
                        variant={
                          statusColor[apt.status] ||
                          'primary'
                        }
                        dot
                        size="xs"
                      >
                        {apt.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {patient
                        ? `Age: ${patient.age} Â· ${patient.gender} Â· Blood: ${patient.bloodGroup}`
                        : 'Patient details unavailable'}
                      {' Â· '}
                      {apt.reason}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-tertiary)]">
                      <Clock size={12} />
                      {apt.time}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() =>
                        viewPatientHistory(
                          apt.patientId
                        )
                      }
                    >
                      History
                    </Button>

                    <Button
                      size="sm"
                      icon={Plus}
                      onClick={() => {
                        setSelectedAppointment(
                          apt
                        );
                        setShowPrescription(true);
                      }}
                    >
                      Prescribe
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Appointment Analytics */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '300ms'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Appointment Analytics
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Overview of your appointment activity
            </p>
          </div>

          <Calendar
            size={22}
            className="text-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          {/* Total */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Total
            </p>

            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {myAppointments.length}
            </p>
          </div>

          {/* Confirmed */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Confirmed
            </p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {confirmedAppointments}
            </p>
          </div>

          {/* Completed */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Completed
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {completedAppointments}
            </p>
          </div>

          {/* Pending */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Pending
            </p>

            <p className="text-2xl font-bold text-orange-500 mt-1">
              {pendingAppointments}
            </p>
          </div>

          {/* Cancelled */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Cancelled
            </p>

            <p className="text-2xl font-bold text-red-500 mt-1">
              {cancelledAppointments}
            </p>
          </div>

        </div>

        {/* Medical Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          <div className="p-4 rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <FileText
                size={20}
                className="text-purple-500"
              />

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Prescriptions Created
                </p>

                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {myPrescriptions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <ClipboardList
                size={20}
                className="text-teal-500"
              />

              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Lab Reports
                </p>

                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {myLabReports.length}
                </p>
              </div>
            </div>
          </div>

        </div>
      </Card>
      {/* Recent Prescriptions */}
      <Card
        className="animate-fade-in-up"
        style={{
          animationDelay: '400ms'
        }}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recent Prescriptions
        </h3>

        {myPrescriptions.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] py-6 text-center">
            No prescriptions found.
          </p>
        ) : (
          <div className="space-y-3">
            {myPrescriptions
              .slice(0, 4)
              .map((presc) => (
                <div
                  key={
                    presc._id ||
                    presc.id
                  }
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
                >
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">
                      {presc.patientName ||
                        'Patient'}
                    </p>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {presc.diagnosis} Â·{' '}
                      {new Date(
                        presc.date
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short'
                        }
                      )}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      generatePrescriptionPDF(
                        presc
                      )
                    }
                  >
                    ðŸ“„ PDF
                  </Button>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Prescription Modal */}
      <Modal
        isOpen={showPrescription}
        onClose={() =>
          setShowPrescription(false)
        }
        title="Create Prescription"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setShowPrescription(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleSavePrescription
              }
            >
              Save Prescription
            </Button>
          </>
        }
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm">
                <span className="font-medium">
                  Patient:
                </span>{' '}
                {selectedAppointment.patientName}
              </p>

              <p className="text-sm">
                <span className="font-medium">
                  Reason:
                </span>{' '}
                {selectedAppointment.reason}
              </p>
            </div>

            <Input
              label="Diagnosis"
              placeholder="e.g. Viral Fever"
              value={
                prescForm.diagnosis
              }
              onChange={(e) =>
                setPrescForm({
                  ...prescForm,
                  diagnosis:
                    e.target.value
                })
              }
            />

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Medicines
              </label>

              {prescForm.medicines.map(
                (medicine, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-2 mb-2"
                  >
                    <Input
                      placeholder="Medicine"
                      value={
                        medicine.name
                      }
                      onChange={(e) =>
                        updateMedicine(
                          i,
                          'name',
                          e.target.value
                        )
                      }
                    />

                    <Input
                      placeholder="Dose"
                      value={
                        medicine.dose
                      }
                      onChange={(e) =>
                        updateMedicine(
                          i,
                          'dose',
                          e.target.value
                        )
                      }
                    />

                    <Input
                      placeholder="Frequency"
                      value={
                        medicine.frequency
                      }
                      onChange={(e) =>
                        updateMedicine(
                          i,
                          'frequency',
                          e.target.value
                        )
                      }
                    />

                    <Input
                      placeholder="Duration"
                      value={
                        medicine.duration
                      }
                      onChange={(e) =>
                        updateMedicine(
                          i,
                          'duration',
                          e.target.value
                        )
                      }
                    />
                  </div>
                )
              )}

              <Button
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={addMedicine}
              >
                Add Medicine
              </Button>
            </div>

            <Textarea
              label="Instructions"
              placeholder="Take medicine after meals..."
              value={
                prescForm.instructions
              }
              onChange={(e) =>
                setPrescForm({
                  ...prescForm,
                  instructions:
                    e.target.value
                })
              }
            />

            <Input
              label="Follow-up Date"
              type="date"
              value={
                prescForm.followUp
              }
              onChange={(e) =>
                setPrescForm({
                  ...prescForm,
                  followUp:
                    e.target.value
                })
              }
            />
          </div>
        )}
      </Modal>

      {/* Patient History Modal */}
      <Modal
        isOpen={showHistory}
        onClose={() =>
          setShowHistory(false)
        }
        title={`Patient History â€” ${selectedPatient?.name || ''
          }`}
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Age
                </p>

                <p className="font-medium text-[var(--text-primary)]">
                  {selectedPatient.age}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Gender
                </p>

                <p className="font-medium text-[var(--text-primary)]">
                  {selectedPatient.gender}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Blood Group
                </p>

                <Badge variant="danger">
                  {selectedPatient.bloodGroup}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Phone
                </p>

                <p className="font-medium text-[var(--text-primary)]">
                  {selectedPatient.phone}
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-[var(--text-primary)]">
              Medical Records
            </h4>

            {patientRecords.length > 0 ? (
              patientRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-[var(--border-color)]"
                >
                  <div className="flex justify-between mb-2">
                    <h5 className="font-medium text-[var(--text-primary)]">
                      {rec.diagnosis}
                    </h5>

                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(
                        rec.date
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }
                      )}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    {rec.notes}
                  </p>

                  <div className="flex gap-4 text-xs text-[var(--text-tertiary)]">
                    <span>
                      BP: {rec.vitals.bp}
                    </span>

                    <span>
                      Temp: {rec.vitals.temp}
                    </span>

                    <span>
                      Pulse: {rec.vitals.pulse}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                No medical records found.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}



