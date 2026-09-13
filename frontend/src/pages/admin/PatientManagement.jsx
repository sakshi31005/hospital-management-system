import { useState, useEffect } from 'react';

import {
  Card,
  Button,
  Badge,
  DataTable,
  SearchInput,
  Modal,
  Pagination,
  Avatar,
  Input,
  Select
} from '../../components/ui';
import { apiUrl } from "../../Api/Api";
import { Eye, MapPin, Plus } from 'lucide-react';



export default function PatientManagement() {

  // =========================
  // PATIENT DATA
  // =========================

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);

  // =========================
  // SEARCH & PAGINATION
  // =========================

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 8;

  // =========================
  // VIEW PATIENT MODAL
  // =========================

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // =========================
  // ADD PATIENT MODAL
  // =========================

  const [showAddModal, setShowAddModal] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: ''
  });

  // =========================
  // FETCH PATIENTS
  // =========================

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(apiUrl("/api/patients"));

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();

      setPatients(data);

    } catch (error) {
      console.error(error);
      setError('Unable to load patients');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD PATIENT
  // =========================

  const handleAddPatient = async (e) => {
    e.preventDefault();

    try {
      setError('');

      const response = await fetch(apiUrl("/api/patients"),
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            ...newPatient,
            age: Number(newPatient.age)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to add patient'
        );
      }

      // Add newly created patient to table
      setPatients((prev) => [...prev, data]);

      // Reset form
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        bloodGroup: '',
        address: ''
      });

      // Close modal
      setShowAddModal(false);

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewPatient((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // SEARCH
  // =========================

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // =========================
  // VIEW PATIENT
  // =========================
  const viewPatient = async (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);

    try {
      const [appointmentsResponse, prescriptionsResponse] =
        await Promise.all([
          fetch(apiUrl('/api/appointments')),
          fetch(apiUrl('/api/prescriptions'))
        ]);

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      if (!prescriptionsResponse.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const appointments = await appointmentsResponse.json();
      const prescriptions = await prescriptionsResponse.json();

      const patientId = patient._id;

      const filteredAppointments = appointments.filter(
        (appointment) =>
          appointment.patientId === patientId
      );

      const filteredPrescriptions = prescriptions.filter(
        (prescription) =>
          prescription.patientId === patientId
      );

      setPatientAppointments(filteredAppointments);
      setPatientRecords(filteredPrescriptions);

    } catch (error) {
      console.error('Failed to load patient history:', error);
      setPatientAppointments([]);
      setPatientRecords([]);
    }
  };


  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      key: 'name',
      label: 'Patient',
      sortable: true,

      render: (val, row) => (
        <div className="flex items-center gap-3">

          <Avatar
            name={val}
            size="sm"
          />

          <div>
            <p className="font-medium">
              {val}
            </p>

            <p className="text-xs text-[var(--text-secondary)]">
              {row.email}
            </p>
          </div>

        </div>
      )
    },

    {
      key: 'age',
      label: 'Age',
      sortable: true
    },

    {
      key: 'gender',
      label: 'Gender'
    },

    {
      key: 'bloodGroup',
      label: 'Blood Group',

      render: (val) => (
        <Badge
          variant="danger"
          size="xs"
        >
          {val}
        </Badge>
      )
    },

    {
      key: 'phone',
      label: 'Phone'
    },

    {
      key: 'status',
      label: 'Status',

      render: (val) => (
        <Badge
          variant="success"
          dot
        >
          {val || 'Active'}
        </Badge>
      )
    },

    {
      key: 'actions',
      label: '',

      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            viewPatient(row);
          }}
        >
          View
        </Button>
      )
    }
  ];

  // =========================
  // JSX
  // =========================

  return (

    <div
      id="patient-management-page"
      className="space-y-6"
    >

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Patient Management
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            View and manage all registered patients
          </p>

        </div>

        <div className="flex items-center gap-3">

          <Badge
            variant="primary"
            size="md"
          >
            {patients.length} Total Patients
          </Badge>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Patient
          </Button>

        </div>

      </div>


      {/* =========================
          PATIENT TABLE
      ========================= */}

      <Card>

        <div className="mb-4">

          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or phone..."
          />

        </div>


        {/* LOADING */}

        {loading && (

          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Loading patients...
          </p>

        )}


        {/* ERROR */}

        {error && (

          <p className="text-sm text-red-500 mb-4">
            {error}
          </p>

        )}


        <DataTable
          columns={columns}
          data={paginated}
          onRowClick={viewPatient}
        />


        <div className="mt-4">

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>

      </Card>


      {/* =====================================================
          ADD PATIENT MODAL
      ===================================================== */}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
        size="lg"
      >

        <form
          onSubmit={handleAddPatient}
          className="space-y-5"
        >

          {/* NAME */}

          <Input
            label="Full Name"
            name="name"
            value={newPatient.name}
            onChange={handleInputChange}
            placeholder="Enter patient's full name"
            required
          />


          {/* EMAIL */}

          <Input
            label="Email"
            name="email"
            type="email"
            value={newPatient.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />


          {/* PHONE */}

          <Input
            label="Phone"
            name="phone"
            value={newPatient.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
          />


          {/* AGE */}

          <Input
            label="Age"
            name="age"
            type="number"
            value={newPatient.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            min="0"
            required
          />


          {/* GENDER */}
          <Select
            label="Gender"
            name="gender"
            value={newPatient.gender}
            onChange={handleInputChange}
            options={[
              { label: 'Select Gender', value: '' },
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]}
          />



          {/* BLOOD GROUP */}
          <Select
            label="Blood Group"
            name="bloodGroup"
            value={newPatient.bloodGroup}
            onChange={handleInputChange}
            options={[
              { label: 'Select Blood Group', value: '' },
              { label: 'A+', value: 'A+' },
              { label: 'A-', value: 'A-' },
              { label: 'B+', value: 'B+' },
              { label: 'B-', value: 'B-' },
              { label: 'AB+', value: 'AB+' },
              { label: 'AB-', value: 'AB-' },
              { label: 'O+', value: 'O+' },
              { label: 'O-', value: 'O-' }
            ]}
          />



          {/* ADDRESS */}

          <Input
            label="Address"
            name="address"
            value={newPatient.address}
            onChange={handleInputChange}
            placeholder="Enter patient's address"
            required
          />


          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4">

            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              Add Patient
            </Button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          PATIENT DETAILS MODAL
      ===================================================== */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Patient Details"
        size="xl"
      >

        {selectedPatient && (

          <div className="space-y-6">

            {/* HEADER */}

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">

              <Avatar
                name={selectedPatient.name}
                size="xl"
              />

              <div className="flex-1">

                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {selectedPatient.name}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Age
                    </p>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {selectedPatient.age} years
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Gender
                    </p>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {selectedPatient.gender}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Blood Group
                    </p>

                    <p className="text-sm font-medium">

                      <Badge variant="danger">
                        {selectedPatient.bloodGroup}
                      </Badge>

                    </p>
                  </div>


                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {selectedPatient.phone}
                    </p>
                  </div>

                </div>


                <p className="text-sm text-[var(--text-secondary)] mt-2 flex items-center gap-1">

                  <MapPin size={14} />

                  {selectedPatient.address}

                </p>

              </div>

            </div>

            {/* MEDICAL HISTORY */}

            <div>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                Medical History
              </h4>

              {patientRecords.length > 0 ? (
                <div className="space-y-3">
                  {patientRecords.map((rec) => (
                    <div
                      key={rec._id}
                      className="p-4 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-[var(--text-primary)]">
                          {rec.diagnosis}
                        </h5>

                        <span className="text-xs text-[var(--text-secondary)]">
                          {new Date(rec.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {rec.medications?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                            Medications
                          </p>

                          <div className="space-y-1">
                            {rec.medications.map((medicine, index) => (
                              <div
                                key={index}
                                className="text-sm text-[var(--text-secondary)]"
                              >
                                <span className="font-medium">
                                  {medicine.name}
                                </span>

                                {" â€” "}

                                {medicine.dosage}

                                {medicine.frequency && (
                                  <> Â· {medicine.frequency}</>
                                )}

                                {medicine.duration && (
                                  <> Â· {medicine.duration}</>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {rec.instructions && (
                        <p className="text-sm text-[var(--text-secondary)] mt-3">
                          <span className="font-medium text-[var(--text-primary)]">
                            Instructions:
                          </span>{" "}
                          {rec.instructions}
                        </p>
                      )}

                      {rec.followUp && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-2">
                          Follow-up:{" "}
                          {new Date(rec.followUp).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  No medical records found.
                </p>
              )}
            </div>

            {/* APPOINTMENTS */}

            {/* APPOINTMENTS */}

            <div>
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                Appointment History
              </h4>

              {patientAppointments.length > 0 ? (
                <div className="space-y-2">
                  {patientAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {apt.doctorName || "Doctor"}
                          {apt.department && ` - ${apt.department}`}
                        </p>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {apt.reason || "No reason provided"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[var(--text-secondary)]">
                          {new Date(apt.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                          {" Â· "}
                          {apt.time}
                        </p>

                        <Badge
                          variant={
                            apt.status === "completed"
                              ? "success"
                              : apt.status === "confirmed"
                                ? "primary"
                                : "warning"
                          }
                          size="xs"
                        >
                          {apt.status || "confirmed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  No appointments found.
                </p>
              )}
            </div>

          </div>
        )}
      </Modal>
      </div>
  );
}
