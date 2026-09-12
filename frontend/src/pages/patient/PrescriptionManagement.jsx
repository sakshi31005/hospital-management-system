import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Button,
  Badge,
  Toast,
} from "../../components/ui";
import {
  ClipboardList,
  Calendar,
  User,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";

export default function PrescriptionManagement() {
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const patientId = user?.patientId;

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      if (!patientId) {
        setPrescriptions([]);
        return;
      }

      const response = await fetch("/api/prescriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data = await response.json();

      // Only show prescriptions belonging to logged-in patient
      const myPrescriptions = data.filter(
        (prescription) =>
          prescription.patientId === patientId
      );

      setPrescriptions(myPrescriptions);
    } catch (error) {
      console.error(
        "Error fetching prescriptions:",
        error
      );

      setToast({
        message: "Failed to load prescriptions",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const downloadPrescriptionPDF = (prescription) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "MediCare HMS - Prescription",
      20,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Doctor: ${prescription.doctorName || "N/A"}`,
      20,
      35
    );

    doc.text(
      `Patient: ${user?.name || "N/A"}`,
      20,
      42
    );

    doc.text(
      `Date: ${
        prescription.date
          ? new Date(
              prescription.date
            ).toLocaleDateString("en-IN")
          : "N/A"
      }`,
      20,
      49
    );

    doc.text(
      `Diagnosis: ${prescription.diagnosis || "N/A"}`,
      20,
      56
    );

    doc.line(20, 62, 190, 62);

    let y = 72;

    doc.setFontSize(12);
    doc.text("Medicines", 20, y);

    y += 8;

    doc.setFontSize(10);

    const medicines =
      prescription.medications || [];

    medicines.forEach((medicine) => {
      doc.text(
        `Medicine: ${medicine.name || ""}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Dosage: ${medicine.dosage || ""}`,
        25,
        y
      );

      y += 6;

      doc.text(
        `Frequency: ${medicine.frequency || ""}`,
        25,
        y
      );

      y += 6;

      doc.text(
        `Duration: ${medicine.duration || ""}`,
        25,
        y
      );

      y += 8;
    });

    doc.text(
      `Instructions: ${
        prescription.instructions || "None"
      }`,
      20,
      y
    );

    y += 10;

    if (prescription.followUp) {
      doc.text(
        `Follow-up: ${new Date(
          prescription.followUp
        ).toLocaleDateString("en-IN")}`,
        20,
        y
      );
    }

    doc.save(
      `prescription_${
        prescription._id || Date.now()
      }.pdf`
    );

    setToast({
      message: "Prescription downloaded",
      type: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading prescriptions...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          My Prescriptions 💊
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          View prescriptions given by your doctors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-500/10">
              <ClipboardList
                size={22}
                className="text-primary-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Total Prescriptions
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {prescriptions.length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success-500/10">
              <Calendar
                size={22}
                className="text-success-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Latest Prescription
              </p>

              <p className="text-sm font-bold text-[var(--text-primary)]">
                {prescriptions.length > 0
                  ? new Date(
                      prescriptions[0].date
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "None"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          padding="p-4"
          className="col-span-2 md:col-span-1"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning-500/10">
              <User
                size={22}
                className="text-warning-500"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Patient
              </p>

              <p className="text-sm font-bold text-[var(--text-primary)]">
                {user?.name || "Patient"}
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Prescription List */}
      <Card>

        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Prescription History
        </h2>

        {prescriptions.length === 0 ? (
          <div className="text-center py-12">

            <ClipboardList
              size={48}
              className="mx-auto text-[var(--text-tertiary)] mb-4"
            />

            <h3 className="text-lg font-medium text-[var(--text-primary)]">
              No prescriptions found
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Your prescriptions will appear here
              after your doctor creates them.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {prescriptions.map(
              (prescription) => (

                <div
                  key={prescription._id}
                  className="p-5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >

                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        {prescription.diagnosis}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Dr.{" "}
                        {prescription.doctorName ||
                          "Unknown Doctor"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <Badge
                        variant="success"
                        size="sm"
                      >
                        Active
                      </Badge>

                      <span className="text-sm text-[var(--text-secondary)]">
                        {prescription.date
                          ? new Date(
                              prescription.date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </span>

                    </div>

                  </div>

                  {/* Medicines */}
                  <div className="mb-4">

                    <h4 className="font-medium text-[var(--text-primary)] mb-3">
                      Medicines 💊
                    </h4>

                    {prescription.medications?.length ? (
                      <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                          <thead>
                            <tr className="border-b border-[var(--border-color)]">

                              <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                                Medicine
                              </th>

                              <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)]">
                                Dosage
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

                            {prescription.medications.map(
                              (medicine, index) => (

                                <tr
                                  key={
                                    medicine._id ||
                                    index
                                  }
                                  className="border-b border-[var(--border-light)]"
                                >

                                  <td className="py-3 px-2 font-medium text-[var(--text-primary)]">
                                    {medicine.name}
                                  </td>

                                  <td className="py-3 px-2 text-[var(--text-secondary)]">
                                    {medicine.dosage}
                                  </td>

                                  <td className="py-3 px-2 text-[var(--text-secondary)]">
                                    {medicine.frequency}
                                  </td>

                                  <td className="py-3 px-2 text-[var(--text-secondary)]">
                                    {medicine.duration}
                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)]">
                        No medicines listed.
                      </p>
                    )}

                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 mb-4">

                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      Instructions
                    </p>

                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {prescription.instructions ||
                        "No instructions provided."}
                    </p>

                  </div>

                  {/* Follow Up */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="text-sm text-[var(--text-secondary)]">

                      <span className="font-medium text-[var(--text-primary)]">
                        Follow-up:
                      </span>{" "}

                      {prescription.followUp
                        ? new Date(
                            prescription.followUp
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "As needed"}

                    </div>

                    <Button
                      size="sm"
                      icon={Download}
                      onClick={() =>
                        downloadPrescriptionPDF(
                          prescription
                        )
                      }
                    >
                      Download PDF
                    </Button>

                  </div>

                </div>

              )
            )}

          </div>
        )}

      </Card>

    </div>
  );
}