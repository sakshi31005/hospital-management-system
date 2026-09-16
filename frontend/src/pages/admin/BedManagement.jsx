import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Badge,
  Modal,
  Select,
  Toast,
  Tabs,
} from "../../components/ui";
import { BedDouble } from "lucide-react";
import { apiUrl } from "../../Api/Api";

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);

  const [activeWard, setActiveWard] = useState("all");
  const [showAssign, setShowAssign] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH BEDS + PATIENTS
  // =========================

  useEffect(() => {
    fetchBeds();
    fetchPatients();
  }, []);

  const fetchBeds = async () => {
    try {
      const response = await fetch(apiUrl("/api/beds"));

      if (!response.ok) {
        throw new Error("Failed to fetch beds");
      }

      const data = await response.json();
      setBeds(data);
    } catch (error) {
      console.error("Error fetching beds:", error);

      setToast({
        message: "Failed to load beds",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(apiUrl("/api/patients"));

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // =========================
  // WARDS
  // =========================

  const wards = [
    {
      id: "all",
      label: "All Wards",
      count: beds.length,
    },
    {
      id: "General Ward",
      label: "General",
      count: beds.filter((b) => b.ward === "General Ward").length,
    },
    {
      id: "ICU",
      label: "ICU",
      count: beds.filter((b) => b.ward === "ICU").length,
    },
    {
      id: "Private Room",
      label: "Private",
      count: beds.filter((b) => b.ward === "Private Room").length,
    },
  ];

  const filteredBeds =
    activeWard === "all"
      ? beds
      : beds.filter((bed) => bed.ward === activeWard);

  // =========================
  // STATUS CONFIG
  // =========================

  const statusConfig = {
    available: {
      color:
        "bg-accent-500/10 border-accent-500/30 hover:border-accent-500",
      text: "text-accent-600",
      badge: "success",
      icon: "🛏️",
    },

    occupied: {
      color: "bg-danger-500/10 border-danger-500/30",
      text: "text-danger-600",
      badge: "danger",
      icon: "🛏️",
    },

    maintenance: {
      color: "bg-warning-500/10 border-warning-500/30",
      text: "text-warning-600",
      badge: "warning",
      icon: "🛏️",
    },
  };

  // =========================
  // STATS
  // =========================

  const stats = {
    total: beds.length,

    occupied: beds.filter(
      (bed) => bed.status === "occupied"
    ).length,

    available: beds.filter(
      (bed) => bed.status === "available"
    ).length,

    maintenance: beds.filter(
      (bed) => bed.status === "maintenance"
    ).length,
  };

  // =========================
  // ASSIGN BED
  // =========================

  const handleAssign = (bed) => {
    setSelectedBed(bed);
    setSelectedPatient("");
    setShowAssign(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedPatient) {
      setToast({
        message: "Please select a patient",
        type: "danger",
      });
      return;
    }

    const patient = patients.find(
      (p) => p._id === selectedPatient
    );

    if (!patient) {
      setToast({
        message: "Patient not found",
        type: "danger",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/beds/${selectedBed._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "occupied",
            patientId: patient._id,
            patientName: patient.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to assign bed"
        );
      }

      await fetchBeds();

      setShowAssign(false);
      setSelectedBed(null);
      setSelectedPatient("");

      setToast({
        message: `Bed ${data.number} assigned to ${patient.name}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error assigning bed:", error);

      setToast({
        message: error.message,
        type: "danger",
      });
    }
  };

  // =========================
  // RELEASE BED
  // =========================

  const handleRelease = async (bed) => {
    try {
      const response = await fetch(
        apiUrl(`/api/beds/${bed._id}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "available",
            patientId: "",
            patientName: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to release bed"
        );
      }

      await fetchBeds();

      setToast({
        message: `Bed ${bed.number} released`,
        type: "success",
      });
    } catch (error) {
      console.error("Error releasing bed:", error);

      setToast({
        message: error.message,
        type: "danger",
      });
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading beds...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      id="bed-management-page"
      className="space-y-6"
    >
      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Bed Management
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            Monitor and manage hospital beds across all wards
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {[
            {
              label: "Available",
              count: stats.available,
              color: "bg-accent-500",
            },
            {
              label: "Occupied",
              count: stats.occupied,
              color: "bg-danger-500",
            },
            {
              label: "Maintenance",
              count: stats.maintenance,
              color: "bg-warning-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
            >
              <span
                className={`w-2 h-2 rounded-full ${s.color}`}
              />

              <span className="text-sm font-medium text-[var(--text-primary)]">
                {s.count}
              </span>

              <span className="text-xs text-[var(--text-secondary)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WARD TABS */}

      <Tabs
        tabs={wards}
        activeTab={activeWard}
        onChange={setActiveWard}
      />

      {/* BED GRID */}

      {filteredBeds.length === 0 ? (
        <Card className="p-10 text-center">
          <BedDouble
            size={48}
            className="mx-auto mb-4 opacity-50"
          />

          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            No beds found
          </h3>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            There are no beds in this ward yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {filteredBeds.map((bed, i) => {
            const cfg =
              statusConfig[bed.status] ||
              statusConfig.available;

            return (
              <div
                key={bed._id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer animate-fade-in ${
                  cfg.color
                } ${
                  bed.status === "available"
                    ? "hover:scale-105"
                    : ""
                }`}
                style={{
                  animationDelay: `${i * 40}ms`,
                }}
                onClick={() =>
                  bed.status === "available"
                    ? handleAssign(bed)
                    : null
                }
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {cfg.icon}
                  </div>

                  <p className="font-bold text-[var(--text-primary)] text-lg">
                    Bed {bed.number}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    {bed.ward}
                  </p>

                  <Badge
                    variant={cfg.badge}
                    size="xs"
                  >
                    {bed.status
                      .charAt(0)
                      .toUpperCase() +
                      bed.status.slice(1)}
                  </Badge>

                  {bed.patientName && (
                    <p className="text-xs text-[var(--text-secondary)] mt-2 truncate">
                      {bed.patientName}
                    </p>
                  )}

                  {bed.status === "occupied" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRelease(bed);
                      }}
                    >
                      Release
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ASSIGN MODAL */}

      <Modal
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={`Assign Bed ${selectedBed?.number || ""}`}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowAssign(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleAssignSubmit}>
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Ward: {selectedBed?.ward} · Rate: ₹
            {selectedBed?.dailyRate}/day
          </p>

          <Select
            label="Select Patient"
            value={selectedPatient}
            onChange={(e) =>
              setSelectedPatient(e.target.value)
            }
            options={[
              {
                value: "",
                label: "Choose patient...",
              },
              ...patients.map((patient) => ({
                value: patient._id,
                label: patient.name,
              })),
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
