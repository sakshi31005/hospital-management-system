import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Spinner,
  Badge,
} from "../../components/ui";
import {
  Calendar,
  ClipboardList,
  TestTube,
  HeartPulse,
} from "lucide-react";

export default function MedicalHistory() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientId = user?.patientId;

  const fetchHistory = async () => {
    try {
      setLoading(true);

      if (!patientId) {
        return;
      }

      const [
        appointmentsRes,
        prescriptionsRes,
        labReportsRes,
      ] = await Promise.all([
        fetch(apiUrl("/api/appointments")),
        fetch(apiUrl("/api/prescriptions")),
        fetch(`/api/lab-reports/patient/${patientId}`),
      ]);

      if (
        !appointmentsRes.ok ||
        !prescriptionsRes.ok ||
        !labReportsRes.ok
      ) {
        throw new Error("Failed to fetch medical history");
      }

      const appointmentsData =
        await appointmentsRes.json();

      const prescriptionsData =
        await prescriptionsRes.json();

      const labReportsData =
        await labReportsRes.json();

      // Only this patient's appointments
      const myAppointments = appointmentsData.filter(
        (appointment) =>
          String(appointment.patientId) ===
          String(patientId)
      );

      // Only this patient's prescriptions
      const myPrescriptions = prescriptionsData.filter(
        (prescription) =>
          String(prescription.patientId) ===
          String(patientId)
      );

      setAppointments(myAppointments);
      setPrescriptions(myPrescriptions);
      setLabReports(labReportsData);
    } catch (error) {
      console.error(
        "Error fetching medical history:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Medical History ðŸ©º
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          View your complete medical history.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-500/10">
              <Calendar
                size={22}
                className="text-primary-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Appointments
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {appointments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <ClipboardList
                size={22}
                className="text-purple-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Prescriptions
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {prescriptions.length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10">
              <TestTube
                size={22}
                className="text-teal-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Lab Reports
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {labReports.length}
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Appointment History */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar
            size={20}
            className="text-primary-500"
          />

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Appointment History
          </h2>
        </div>

        {appointments.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No appointment history found.
          </p>
        ) : (
          <div className="space-y-3">

            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-4 rounded-xl border border-[var(--border-color)]"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-3">

                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {appointment.doctorName ||
                        "Doctor"}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {appointment.department ||
                        "General Consultation"}
                    </p>

                    {appointment.reason && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Reason: {appointment.reason}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-[var(--text-secondary)]">
                    <p>
                      Date: {appointment.date}
                    </p>

                    <p>
                      Time: {appointment.time}
                    </p>

                    <Badge
                      variant={
                        appointment.status ===
                        "completed"
                          ? "success"
                          : appointment.status ===
                            "cancelled"
                          ? "danger"
                          : "primary"
                      }
                      size="xs"
                    >
                      {appointment.status}
                    </Badge>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </Card>

      {/* Prescription History */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList
            size={20}
            className="text-purple-500"
          />

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Prescription History
          </h2>
        </div>

        {prescriptions.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No prescriptions found.
          </p>
        ) : (
          <div className="space-y-4">

            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="p-4 rounded-xl border border-[var(--border-color)]"
              >

                <div className="flex justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {prescription.diagnosis}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)]">
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
                {prescription.medications?.length >
                  0 && (
                  <div className="space-y-2">

                    {prescription.medications.map(
                      (medicine, index) => (
                        <div
                          key={
                            medicine._id ||
                            index
                          }
                          className="p-3 rounded-lg bg-[var(--bg-tertiary)]"
                        >
                          <p className="font-medium text-[var(--text-primary)]">
                            {medicine.name}
                          </p>

                          <p className="text-sm text-[var(--text-secondary)]">
                            Dosage:{" "}
                            {medicine.dosage}
                          </p>

                          <p className="text-sm text-[var(--text-secondary)]">
                            Frequency:{" "}
                            {medicine.frequency}
                          </p>

                          <p className="text-sm text-[var(--text-secondary)]">
                            Duration:{" "}
                            {medicine.duration}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

                {prescription.instructions && (
                  <div className="mt-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                      <strong>
                        Instructions:
                      </strong>{" "}
                      {prescription.instructions}
                    </p>
                  </div>
                )}

                {prescription.followUp && (
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    <strong>Follow-up:</strong>{" "}
                    {new Date(
                      prescription.followUp
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}
      </Card>

      {/* Lab Reports */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TestTube
            size={20}
            className="text-teal-500"
          />

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Lab Reports
          </h2>
        </div>

        {labReports.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No lab reports found.
          </p>
        ) : (
          <div className="space-y-3">

            {labReports.map((report) => (
              <div
                key={report._id}
                className="p-4 rounded-xl border border-[var(--border-color)]"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-3">

                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {report.testName}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {report.testType ||
                        "Laboratory Test"}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="text-[var(--text-primary)]">
                      <strong>Result:</strong>{" "}
                      {report.result}
                    </p>

                    <p className="text-[var(--text-secondary)]">
                      Normal Range:{" "}
                      {report.normalRange ||
                        "Not specified"}
                    </p>

                    <p className="text-[var(--text-secondary)]">
                      Status: {report.status}
                    </p>
                  </div>

                </div>

                {report.notes && (
                  <p className="text-sm text-[var(--text-secondary)] mt-3">
                    <strong>Notes:</strong>{" "}
                    {report.notes}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}
      </Card>

      {/* Empty medical history */}
      {appointments.length === 0 &&
        prescriptions.length === 0 &&
        labReports.length === 0 && (
          <Card className="p-8 text-center">
            <HeartPulse
              size={48}
              className="mx-auto mb-3 text-[var(--text-tertiary)]"
            />

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              No medical history yet
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Your medical records will appear here
              as you receive treatment.
            </p>
          </Card>
        )}

    </div>
  );
}



