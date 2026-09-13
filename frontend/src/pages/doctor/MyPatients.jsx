import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Eye,
  X,
  Calendar,
  ClipboardList,
  TestTube,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Card, Input, Spinner, Button } from "../../components/ui";

const MyPatients = () => {
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // History
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    if (user?.doctorId) {
      fetchData();
    }
  }, [user?.doctorId]);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsRes, appointmentsRes] = await Promise.all([
        fetch(apiUrl("/api/patients")),
        fetch(apiUrl("/api/appointments")),
      ]);

      if (!patientsRes.ok || !appointmentsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const patientsData = await patientsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error(err);
      setError("Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Get patient IDs who have appointments with this doctor
  console.log("===== DOCTOR PATIENT DEBUG =====");
  console.log("Logged in user:", user);
  console.log("Logged in doctorId:", user?.doctorId);
  console.log("All appointments:", appointments);
  console.log("All patients:", patients);
  const myPatientIds = [
    ...new Set(
      appointments
        .filter(
          (appointment) =>
            String(appointment.doctorId) ===
            String(user?.doctorId)
        )
        .map((appointment) => String(appointment.patientId))
    ),
  ];

  // Only show this doctor's patients
  const myPatients = patients.filter((patient) =>
    myPatientIds.includes(String(patient._id))
  );

  // Search patients
  const filteredPatients = myPatients.filter((patient) => {
    const text = search.toLowerCase();

    return (
      patient.name?.toLowerCase().includes(text) ||
      patient.email?.toLowerCase().includes(text) ||
      patient.phone?.toLowerCase().includes(text)
    );
  });

  // Open patient history
  const handleViewHistory = async (patient) => {
    try {
      setSelectedPatient(patient);
      setHistoryLoading(true);

      const [prescriptionsRes, labReportsRes, medicalRecordsRes] = await Promise.all([
        fetch(apiUrl("/api/prescriptions")),
        fetch(`/api/lab-reports/patient/${patient._id}`),
        fetch(`/api/medical-records/patient/${patient._id}`),
      ]);

      if (!prescriptionsRes.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      if (!labReportsRes.ok) {
        throw new Error("Failed to fetch lab reports");
      }
      if (!medicalRecordsRes.ok) {
        throw new Error("Failed to fetch medical records");
      }
      const prescriptionsData = await prescriptionsRes.json();
      const labReportsData = await labReportsRes.json();
      const medicalRecordsData = await medicalRecordsRes.json();

      // Only prescriptions for selected patient
      const patientPrescriptions = prescriptionsData.filter(
        (prescription) =>
          prescription.patientId === patient._id
      );

      setPrescriptions(patientPrescriptions);
      setLabReports(labReportsData);
      setMedicalRecords(medicalRecordsData);
    } catch (err) {
      console.error("History error:", err);
      setPrescriptions([]);
      setLabReports([]);
      setMedicalRecords([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setSelectedPatient(null);
    setPrescriptions([]);
    setLabReports([]);
    setMedicalRecords([]);
  };

  // Selected patient's appointments
  const patientAppointments = selectedPatient
    ? appointments.filter(
      (appointment) =>
        appointment.patientId === selectedPatient._id &&
        appointment.doctorId === user?.doctorId
    )
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Patients
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Patients assigned to you through appointments
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search patients by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* Patient count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {filteredPatients.length}
        </span>{" "}
        patient{filteredPatients.length !== 1 ? "s" : ""}
      </div>

      {/* Patients */}
      {filteredPatients.length === 0 ? (
        <Card className="p-10 text-center">
          <User
            className="mx-auto mb-3 text-gray-400"
            size={40}
          />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No patients found
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Patients with appointments assigned to you will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredPatients.map((patient) => (
            <Card key={patient._id} className="p-5">

              {/* Name */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <User
                    className="text-indigo-600"
                    size={24}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {patient.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {patient.gender}, {patient.age} years
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-3">
                  <Phone
                    size={16}
                    className="text-gray-400"
                  />
                  <span>{patient.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail
                    size={16}
                    className="text-gray-400"
                  />
                  <span className="truncate">
                    {patient.email}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="text-gray-400 mt-0.5"
                  />
                  <span>{patient.address}</span>
                </div>

              </div>

              {/* Blood group */}
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500">
                  Blood Group
                </span>

                <p className="font-semibold text-red-500">
                  {patient.bloodGroup}
                </p>
              </div>

              {/* View History */}
              <div className="mt-5">
                <Button
                  size="sm"
                  icon={Eye}
                  className="w-full"
                  onClick={() =>
                    handleViewHistory(patient)
                  }
                >
                  View Patient History
                </Button>
              </div>

            </Card>
          ))}

        </div>
      )}

      {/* Patient History Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Patient History
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedPatient.name} â€¢{" "}
                  {selectedPatient.age} years â€¢{" "}
                  {selectedPatient.gender}
                </p>
              </div>

              <button
                onClick={closeHistory}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={22} />
              </button>

            </div>

            {historyLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : (
              <div className="p-5 space-y-6">

                {/* Patient Information */}
                <Card className="p-5">

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Patient Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

                    <div>
                      <p className="text-gray-500">
                        Name
                      </p>
                      <p className="font-medium">
                        {selectedPatient.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Age
                      </p>
                      <p className="font-medium">
                        {selectedPatient.age}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Gender
                      </p>
                      <p className="font-medium">
                        {selectedPatient.gender}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Blood Group
                      </p>
                      <p className="font-medium text-red-500">
                        {selectedPatient.bloodGroup}
                      </p>
                    </div>

                  </div>

                </Card>

                {/* Appointments */}
                <Card className="p-5">

                  <div className="flex items-center gap-2 mb-4">
                    <Calendar
                      size={20}
                      className="text-primary-500"
                    />

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Appointment History
                    </h3>
                  </div>

                  {patientAppointments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No appointment history found.
                    </p>
                  ) : (
                    <div className="space-y-3">

                      {patientAppointments.map(
                        (appointment) => (
                          <div
                            key={
                              appointment._id ||
                              appointment.id
                            }
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between gap-2">

                              <div>
                                <p className="font-medium">
                                  {appointment.department ||
                                    "General Consultation"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {appointment.reason ||
                                    "No reason provided"}
                                </p>
                              </div>

                              <div className="text-sm text-gray-500">
                                <p>
                                  Date:{" "}
                                  {appointment.date}
                                </p>

                                <p>
                                  Time:{" "}
                                  {appointment.time}
                                </p>

                                <p>
                                  Status:{" "}
                                  {appointment.status}
                                </p>
                              </div>

                            </div>
                          </div>
                        )
                      )}

                    </div>
                  )}

                </Card>

                {/* Prescriptions */}
                <Card className="p-5">

                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList
                      size={20}
                      className="text-primary-500"
                    />

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Prescription History
                    </h3>
                  </div>

                  {prescriptions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No prescriptions found.
                    </p>
                  ) : (
                    <div className="space-y-4">

                      {prescriptions.map(
                        (prescription) => (
                          <div
                            key={prescription._id}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                          >

                            <div className="flex justify-between gap-3 mb-3">
                              <div>
                                <p className="font-semibold">
                                  {prescription.diagnosis}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {prescription.date
                                    ? new Date(
                                      prescription.date
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            {/* Medicines */}
                            {prescription.medications?.length > 0 && (
                              <div className="space-y-2">

                                {prescription.medications.map(
                                  (medicine, index) => (
                                    <div
                                      key={
                                        medicine._id ||
                                        index
                                      }
                                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                                    >
                                      <p className="font-medium">
                                        {medicine.name}
                                      </p>

                                      <p className="text-sm text-gray-500">
                                        Dosage:{" "}
                                        {medicine.dosage}
                                      </p>

                                      <p className="text-sm text-gray-500">
                                        Frequency:{" "}
                                        {medicine.frequency}
                                      </p>

                                      <p className="text-sm text-gray-500">
                                        Duration:{" "}
                                        {medicine.duration}
                                      </p>
                                    </div>
                                  )
                                )}

                              </div>
                            )}

                            {prescription.instructions && (
                              <p className="text-sm mt-3">
                                <strong>
                                  Instructions:
                                </strong>{" "}
                                {prescription.instructions}
                              </p>
                            )}

                            {prescription.followUp && (
                              <p className="text-sm mt-2">
                                <strong>
                                  Follow-up:
                                </strong>{" "}
                                {new Date(
                                  prescription.followUp
                                ).toLocaleDateString(
                                  "en-IN"
                                )}
                              </p>
                            )}

                          </div>
                        )
                      )}

                    </div>
                  )}

                </Card>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3">
                    Medical Records
                  </h4>

                  {medicalRecords.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">
                      No medical records found.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {medicalRecords.map((record) => (
                        <div
                          key={record._id}
                          className="p-4 rounded-xl border border-[var(--border-color)]"
                        >
                          <div className="flex justify-between mb-2">
                            <h5 className="font-medium text-[var(--text-primary)]">
                              {record.diagnosis}
                            </h5>

                            <span className="text-xs text-[var(--text-secondary)]">
                              {new Date(
                                record.recordDate
                              ).toLocaleDateString("en-IN")}
                            </span>
                          </div>

                          <p className="text-sm text-[var(--text-secondary)] mb-3">
                            {record.notes || "No notes"}
                          </p>

                          <div className="flex gap-4 text-xs text-[var(--text-tertiary)]">
                            <span>
                              BP: {record.vitals?.bp || "-"}
                            </span>

                            <span>
                              Temp: {record.vitals?.temp || "-"}
                            </span>

                            <span>
                              Pulse: {record.vitals?.pulse || "-"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lab Reports */}
                <Card className="p-5">

                  <div className="flex items-center gap-2 mb-4">
                    <TestTube
                      size={20}
                      className="text-primary-500"
                    />

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Lab Reports
                    </h3>
                  </div>

                  {labReports.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No lab reports found.
                    </p>
                  ) : (
                    <div className="space-y-3">

                      {labReports.map((report) => (
                        <div
                          key={report._id}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >

                          <div className="flex flex-col md:flex-row md:justify-between gap-3">

                            <div>
                              <p className="font-semibold">
                                {report.testName}
                              </p>

                              <p className="text-sm text-gray-500">
                                {report.testType ||
                                  "Laboratory Test"}
                              </p>
                            </div>

                            <div className="text-sm">
                              <p>
                                <strong>
                                  Result:
                                </strong>{" "}
                                {report.result}
                              </p>

                              <p className="text-gray-500">
                                Normal Range:{" "}
                                {report.normalRange ||
                                  "Not specified"}
                              </p>

                              <p className="text-gray-500">
                                Status:{" "}
                                {report.status}
                              </p>
                            </div>

                          </div>

                          {report.notes && (
                            <p className="text-sm mt-3">
                              <strong>
                                Notes:
                              </strong>{" "}
                              {report.notes}
                            </p>
                          )}

                        </div>
                      ))}

                    </div>
                  )}

                </Card>

              </div>
            )}

            {/* Close */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-5 flex justify-end">
              <Button
                variant="secondary"
                onClick={closeHistory}
              >
                Close
              </Button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MyPatients;


