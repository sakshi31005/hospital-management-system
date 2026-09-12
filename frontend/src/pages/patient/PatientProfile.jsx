import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Button,
  Input,
  Textarea,
  Badge,
  Spinner,
} from "../../components/ui";
import {
  User,
  Mail,
  Phone,
  Calendar,
  HeartPulse,
  MapPin,
  Edit3,
  Save,
  X,
} from "lucide-react";

export default function PatientProfile() {
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    bloodGroup: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const patientId = user?.patientId;

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/patients");

      if (!response.ok) {
        throw new Error("Failed to fetch patient profile");
      }

      const data = await response.json();

      const currentPatient = data.find(
        (p) =>
          String(p._id) === String(patientId) ||
          String(p.id) === String(patientId)
      );

      if (!currentPatient) {
        throw new Error("Patient profile not found");
      }

      setPatient(currentPatient);

      setFormData({
        name: currentPatient.name || "",
        age: currentPatient.age || "",
        gender: currentPatient.gender || "",
        address: currentPatient.address || "",
        phone: currentPatient.phone || "",
        email: currentPatient.email || "",
        bloodGroup: currentPatient.bloodGroup || "",
      });
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/patients/${patient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            bloodGroup: formData.bloodGroup,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setPatient(data);

      setFormData({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        bloodGroup: data.bloodGroup || "",
      });

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating patient:", err);
      setError(err.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!patient) return;

    setFormData({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      address: patient.address || "",
      phone: patient.phone || "",
      email: patient.email || "",
      bloodGroup: patient.bloodGroup || "",
    });

    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !patient) {
    return (
      <Card>
        <div className="py-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <div className="py-10 text-center">
          <p className="text-[var(--text-secondary)]">
            Patient profile not found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            My Profile
          </h1>

          <p className="mt-1 text-[var(--text-secondary)]">
            View and manage your personal information.
          </p>
        </div>

        {!editing ? (
          <Button
            icon={Edit3}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={X}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              icon={Save}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <User
              size={38}
              className="text-primary-500"
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {patient.name}
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Patient
            </p>

            <div className="mt-3">
              <Badge
                variant={
                  patient.status === "active"
                    ? "success"
                    : "warning"
                }
                dot
              >
                {patient.status || "active"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">
          Personal Information
        </h3>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />

            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) =>
                handleChange("age", e.target.value)
              }
            />

            <Input
              label="Gender"
              value={formData.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value)
              }
            />

            <Input
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) =>
                handleChange(
                  "bloodGroup",
                  e.target.value
                )
              }
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />

            <div className="md:col-span-2">
              <Textarea
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  handleChange(
                    "address",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem
              icon={User}
              label="Full Name"
              value={patient.name}
            />

            <InfoItem
              icon={Calendar}
              label="Age"
              value={`${patient.age} years`}
            />

            <InfoItem
              icon={User}
              label="Gender"
              value={patient.gender}
            />

            <InfoItem
              icon={HeartPulse}
              label="Blood Group"
              value={patient.bloodGroup}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={patient.email}
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={patient.phone}
            />

            <div className="md:col-span-2">
              <InfoItem
                icon={MapPin}
                label="Address"
                value={patient.address}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-[var(--bg-tertiary)]">
        <Icon
          size={18}
          className="text-primary-500"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-[var(--text-tertiary)]">
          {label}
        </p>

        <p className="font-medium text-[var(--text-primary)] break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}