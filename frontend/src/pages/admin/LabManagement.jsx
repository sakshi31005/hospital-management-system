import { useEffect, useState } from "react";
import {
  Card,
  Badge,
  DataTable,
  SearchInput,
  Tabs,
} from "../../components/ui";
import {
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { apiUrl } from "../../Api/Api";

export default function LabManagement() {
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH LAB REPORTS
  // =========================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(apiUrl("/api/lab-reports"));

      if (!response.ok) {
        throw new Error("Failed to fetch lab reports");
      }

      const data = await response.json();

      setReports(data);
    } catch (error) {
      console.error("Error fetching lab reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TABS
  // =========================

  const tabs = [
    {
      id: "all",
      label: "All",
      count: reports.length,
    },
    {
      id: "normal",
      label: "Normal",
      count: reports.filter(
        (report) => report.status === "normal"
      ).length,
    },
    {
      id: "abnormal",
      label: "Abnormal",
      count: reports.filter(
        (report) => report.status === "abnormal"
      ).length,
    },
    {
      id: "pending",
      label: "Pending",
      count: reports.filter(
        (report) => report.status === "pending"
      ).length,
    },
  ];

  // =========================
  // FILTER
  // =========================

  const filtered = reports.filter((report) => {
    const patientName =
      report.patientName?.toLowerCase() || "";

    const testName =
      report.testName?.toLowerCase() || "";

    const searchText = search.toLowerCase();

    const matchSearch =
      patientName.includes(searchText) ||
      testName.includes(searchText);

    const matchTab =
      activeTab === "all" ||
      report.status === activeTab;

    return matchSearch && matchTab;
  });

  // =========================
  // STATUS
  // =========================

  const statusColor = {
    normal: "success",
    abnormal: "danger",
    pending: "warning",
  };

  const statusIcon = {
    normal: CheckCircle,
    abnormal: AlertCircle,
    pending: Clock,
  };

  // =========================
  // TABLE
  // =========================

  const columns = [
    {
      key: "testName",
      label: "Test",
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {value}
        </span>
      ),
    },

    {
      key: "patientName",
      label: "Patient",
      sortable: true,
    },

    {
      key: "doctorName",
      label: "Requested By",
      render: (value) =>
        value || "Not specified",
    },

    {
      key: "reportDate",
      label: "Date",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "-",
    },

    {
      key: "status",
      label: "Status",
      render: (value) => {
        const Icon =
          statusIcon[value] || Clock;

        return (
          <div className="flex items-center gap-2">
            <Icon size={15} />

            <Badge
              variant={
                statusColor[value] || "info"
              }
              dot
            >
              {value
                ? value.charAt(0).toUpperCase() +
                  value.slice(1)
                : "Unknown"}
            </Badge>
          </div>
        );
      },
    },
  ];

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading lab reports...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      id="lab-management-page"
      className="space-y-6"
    >
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Lab Reports
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          Track and manage laboratory test reports
        </p>
      </div>

      {/* REPORT TABLE */}

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search lab reports..."
            className="md:w-64"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[var(--text-secondary)]">
              No lab reports found.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
          />
        )}
      </Card>

      {/* REPORT DETAILS */}

      {filtered.map((report) => (
        <Card
          key={report._id}
          className="animate-fade-in-up"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">
                {report.testName}
              </h3>

              <p className="text-sm text-[var(--text-secondary)]">
                {report.patientName}
                {" · "}
                {report.reportDate
                  ? new Date(
                      report.reportDate
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Date not available"}
              </p>
            </div>

            <Badge
              variant={
                statusColor[report.status] ||
                "info"
              }
            >
              {report.status
                ? report.status
                    .charAt(0)
                    .toUpperCase() +
                  report.status.slice(1)
                : "Unknown"}
            </Badge>
          </div>

          {/* REPORT INFORMATION */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Test Type
              </p>

              <p className="font-medium text-[var(--text-primary)] mt-1">
                {report.testType || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Doctor
              </p>

              <p className="font-medium text-[var(--text-primary)] mt-1">
                {report.doctorName ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Result
              </p>

              <p
                className={`font-semibold mt-1 ${
                  report.status === "abnormal"
                    ? "text-danger-500"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {report.result || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Normal Range
              </p>

              <p className="font-medium text-[var(--text-primary)] mt-1">
                {report.normalRange || "-"}
              </p>
            </div>
          </div>

          {/* NOTES */}

          {report.notes && (
            <div className="mt-4 p-3 rounded-lg bg-[var(--bg-secondary)]">
              <p className="text-xs text-[var(--text-secondary)] mb-1">
                Notes
              </p>

              <p className="text-sm text-[var(--text-primary)]">
                {report.notes}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
