import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Badge,
  DataTable,
  SearchInput,
  Tabs,
  Toast,
  Modal,
  Input
} from '../../components/ui';
import { apiUrl } from "../../Api/Api";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
const todayStr = new Date().toISOString().split('T')[0];

export default function AppointmentManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');

  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('confirmed');

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(apiUrl("/api/appointments"));

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setToast({
        message: 'Failed to load appointments',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchPatients = async () => {
    try {
      const response = await fetch(apiUrl("/api/patients"));

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(apiUrl("/api/doctors"));

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
  const tabs = [
    { id: 'today', label: "Today's", count: appointments.filter(a => a.date === todayStr).length },
    { id: 'upcoming', label: 'Upcoming', count: appointments.filter(a => a.date > todayStr).length },
    { id: 'past', label: 'Past', count: appointments.filter(a => a.date < todayStr).length },
    { id: 'all', label: 'All', count: appointments.length },
  ];

  const filtered = appointments.filter((a) => {
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'today') return matchSearch && a.date === todayStr;
    if (activeTab === 'upcoming') return matchSearch && a.date > todayStr;
    if (activeTab === 'past') return matchSearch && a.date < todayStr;
    return matchSearch;
  }).sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date));

  const statusColor = { confirmed: 'primary', completed: 'success', waiting: 'warning', cancelled: 'danger', pending: 'warning' };
  const statusIcon = { confirmed: CheckCircle, completed: CheckCircle, waiting: Clock, cancelled: XCircle };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(apiUrl(`/api/appointments/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      await fetchAppointments();

      setToast({
        message:
          newStatus === "completed"
            ? "Appointment marked as completed"
            : "Appointment cancelled",
        type: newStatus === "completed" ? "success" : "warning",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);

      setToast({
        message: error.message,
        type: "danger",
      });
    }
  };
  const columns = [
    { key: 'patientName', label: 'Patient', sortable: true },
    { key: 'doctorName', label: 'Doctor', sortable: true },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date', sortable: true, render: (val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    { key: 'time', label: 'Time', sortable: true },
    { key: 'reason', label: 'Reason', render: (val) => <span className="text-sm truncate max-w-[200px] block">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={statusColor[val] || 'default'} dot>{val.charAt(0).toUpperCase() + val.slice(1)}</Badge> },
    {
      key: 'actions',
      label: '',
      render: (_, row) =>
        row.status === 'confirmed' || row.status === 'waiting' ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusUpdate(row._id, "completed")}
            >
              âœ“
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-danger-500"
              onClick={() => handleStatusUpdate(row._id, "cancelled")}
            >
              âœ•
            </Button>
          </div>
        ) : null,
    },
  ];

  // Stats for today
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const stats = [
    { label: 'Total', value: todayAppts.length, icon: Calendar, color: 'bg-primary-500/10 text-primary-500' },
    { label: 'Confirmed', value: todayAppts.filter(a => a.status === 'confirmed').length, icon: CheckCircle, color: 'bg-accent-500/10 text-accent-500' },
    { label: 'Waiting', value: todayAppts.filter(a => a.status === 'waiting').length, icon: Clock, color: 'bg-warning-500/10 text-warning-500' },
    { label: 'Completed', value: todayAppts.filter(a => a.status === 'completed').length, icon: CheckCircle, color: 'bg-teal-500/10 text-teal-500' },
    { label: 'Cancelled', value: todayAppts.filter(a => a.status === 'cancelled').length, icon: XCircle, color: 'bg-danger-500/10 text-danger-500' },
  ];

  const handleAddAppointment = () => {
    setPatientId('');
    setPatientName('');

    setDoctorId('');
    setDoctorName('');

    setDate('');
    setTime('');
    setStatus('confirmed');

    setShowModal(true);
  };

  const handleSaveAppointment = async () => {
    console.log("Patient ID:", patientId);
    console.log("Doctor ID:", doctorId);
    try {
      if (!patientId || !doctorId || !date || !time) {
        setToast({
          message: 'Please fill all required fields',
          type: 'danger',
        });
        return;
      }

      const appointmentData = {
        patientId,
        patientName,
        doctorId,
        doctorName,
        date,
        time,
        status,
      };

      const response = await fetch(
        apiUrl("/api/appointments"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add appointment');
      }

      // Refresh appointments from MongoDB
      await fetchAppointments();

      setShowModal(false);

      setToast({
        message: 'Appointment added successfully',
        type: 'success',
      });

      // Clear form
      setPatientName('');
      setDoctorName('');
      setDate('');
      setTime('');
      setStatus('confirmed');

    } catch (error) {
      console.error('Error adding appointment:', error);

      setToast({
        message: error.message,
        type: 'danger',
      });
    }
  };

  return (
    <div id="appointment-management-page" className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Appointments
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage and track all hospital appointments
          </p>
        </div>

        <Button icon={Plus} onClick={handleAddAppointment}>
          Add Appointment
        </Button>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <Card key={s.label} padding="p-4" className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color}`}><s.icon size={18} /></div>
              <div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <SearchInput value={search} onChange={setSearch} placeholder="Search appointments..." className="md:w-64" />
        </div>
        <DataTable columns={columns} data={filtered} emptyMessage="No appointments found" />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Appointment"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSaveAppointment}>
              Save Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Patient
            </label>

            <select
              value={patientId}
              onChange={(e) => {
                const selectedPatient = patients.find(
                  (patient) => patient._id === e.target.value
                );

                setPatientId(e.target.value);
                setPatientName(selectedPatient?.name || '');
              }}
              className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)]"
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Doctor
            </label>

            <select
              value={doctorId}
              onChange={(e) => {
                const selectedDoctor = doctors.find(
                  (doctor) => doctor._id === e.target.value
                );

                setDoctorId(e.target.value);
                setDoctorName(selectedDoctor?.name || '');
              }}
              className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-primary)]"
            >
              <option value="">Select Doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <Input
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="confirmed"
          />

        </div>
      </Modal>
    </div>
  );
}

