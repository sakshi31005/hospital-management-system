import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Badge,
  Spinner,
} from "../../components/ui";
import {
  Bed,
  Building2,
  IndianRupee,
  User,
} from "lucide-react";

export default function PatientBed() {
  const { user } = useAuth();

  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientId = user?.patientId;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchBed = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(apiUrl("/api/beds"));

        if (!response.ok) {
          throw new Error("Failed to fetch bed information");
        }

        const data = await response.json();

        const myBeds = data.filter(
          (bed) =>
            String(bed.patientId) === String(patientId)
        );

        setBeds(myBeds);
      } catch (err) {
        console.error("Error fetching bed:", err);
        setError("Unable to load bed information.");
      } finally {
        setLoading(false);
      }
    };

    fetchBed();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          My Bed / Room
        </h1>

        <p className="mt-1 text-[var(--text-secondary)]">
          View your current hospital bed or room details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card>
          <p className="text-red-500 text-center py-6">
            {error}
          </p>
        </Card>
      )}

      {/* No Bed */}
      {!error && beds.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <Bed
              size={48}
              className="mx-auto mb-4 text-[var(--text-tertiary)]"
            />

            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              No Bed or Room Assigned
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You currently don't have a hospital bed or room assigned.
            </p>
          </div>
        </Card>
      )}

      {/* Bed Cards */}
      {beds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beds.map((bed) => (
            <Card
              key={bed._id || bed.id}
              className="animate-fade-in-up"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
                    <Bed
                      size={24}
                      className="text-primary-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                      Bed {bed.number}
                    </h2>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {bed.ward}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    bed.status === "occupied"
                      ? "danger"
                      : bed.status === "available"
                      ? "success"
                      : "warning"
                  }
                  dot
                >
                  {bed.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2
                    size={18}
                    className="text-[var(--text-tertiary)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Ward
                    </p>

                    <p className="font-medium text-[var(--text-primary)]">
                      {bed.ward}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee
                    size={18}
                    className="text-[var(--text-tertiary)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Daily Rate
                    </p>

                    <p className="font-medium text-[var(--text-primary)]">
                      â‚¹{bed.dailyRate}
                      <span className="text-xs font-normal text-[var(--text-secondary)]">
                        {" "}
                        / day
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User
                    size={18}
                    className="text-[var(--text-tertiary)]"
                  />

                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Patient
                    </p>

                    <p className="font-medium text-[var(--text-primary)]">
                      {bed.patientName || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-6 p-4 rounded-xl bg-[var(--bg-tertiary)]">
                {bed.status === "occupied" ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    ðŸ›ï¸ This bed is currently assigned to you.
                  </p>
                ) : bed.status === "maintenance" ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    âš ï¸ This bed is currently under maintenance.
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">
                    â„¹ï¸ This bed is currently available.
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


