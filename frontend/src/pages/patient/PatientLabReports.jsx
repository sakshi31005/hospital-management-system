import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Badge,
  Spinner,
} from "../../components/ui";
import {
  TestTube,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { apiUrl } from "../../Api/Api";

export default function PatientLabReports() {
  const { user } = useAuth();

  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientId = user?.patientId;

  useEffect(() => {
    const fetchLabReports = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(apiUrl(`/api/lab-reports/patient/${patientId}`));

        if (!response.ok) {
          throw new Error("Failed to fetch lab reports");
        }

        const data = await response.json();

        setLabReports(data);
      } catch (error) {
        console.error("Error fetching lab reports:", error);
        setError("Unable to load lab reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabReports();
  }, [patientId]);

  const statusVariant = {
    normal: "success",
    abnormal: "danger",
    pending: "warning",
  };

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
          My Lab Reports
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          View your laboratory test results and reports.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <TestTube
              size={24}
              className="text-primary-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Reports
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {labReports.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <FileText
              size={24}
              className="text-success-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Normal
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {
                  labReports.filter(
                    (report) => report.status === "normal"
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <TestTube
              size={24}
              className="text-warning-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Pending
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {
                  labReports.filter(
                    (report) => report.status === "pending"
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card>
          <p className="text-sm text-red-500">
            {error}
          </p>
        </Card>
      )}

      {/* Reports */}
      <Card>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Laboratory Reports
        </h3>

        {labReports.length === 0 ? (
          <div className="py-10 text-center">
            <TestTube
              size={40}
              className="mx-auto mb-3 text-[var(--text-tertiary)]"
            />

            <p className="text-[var(--text-secondary)]">
              No lab reports found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {labReports.map((report) => (
              <div
                key={report._id || report.id}
                className="p-4 rounded-xl border border-[var(--border-color)]"
              >
                {/* Top */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {report.testName}
                    </h4>

                    {report.testType && (
                      <p className="text-sm text-[var(--text-secondary)]">
                        {report.testType}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant={
                      statusVariant[report.status] || "primary"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Result
                    </p>

                    <p className="font-medium text-[var(--text-primary)]">
                      {report.result}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Normal Range
                    </p>

                    <p className="font-medium text-[var(--text-primary)]">
                      {report.normalRange || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Doctor
                    </p>

                    <div className="flex items-center gap-1">
                      <User size={14} />

                      <p className="text-sm text-[var(--text-primary)]">
                        {report.doctorName || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Report Date
                    </p>

                    <div className="flex items-center gap-1">
                      <Calendar size={14} />

                      <p className="text-sm text-[var(--text-primary)]">
                        {report.reportDate
                          ? new Date(
                              report.reportDate
                            ).toLocaleDateString("en-IN")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {report.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">
                      Notes
                    </p>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {report.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}