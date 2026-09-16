import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Button,
  Input,
  Textarea,
  Spinner,
} from "../../components/ui";
import {
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function PatientBookAppointment() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    department: "",
    date: "",
    time: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [doctorsResponse, departmentsResponse] =
        await Promise.all([
          fetch(apiUrl("/api/doctors")),
          fetch(apiUrl("/api/departments")),
        ]);

      if (!doctorsResponse.ok || !departmentsResponse.ok) {
        throw new Error("Failed to load doctors or departments");
      }

      const doctorsData = await doctorsResponse.json();
      const departmentsData =
        await departmentsResponse.json();

      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (err) {
      console.error("Error loading appointment data:", err);
      setError("Unable to load appointment information.");
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

  const handleDoctorChange = (doctorId) => {
    const doctor = doctors.find(
      (item) =>
        String(item._id || item.id) === String(doctorId)
    );

    setFormData((previous) => ({
      ...previous,
      doctorId,
      doctorName: doctor?.name || "",
      department: doctor?.department || "",
    }));
  };

  const handleBookAppointment = async () => {
    setError("");
    setSuccess("");

    if (!formData.doctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!formData.date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!formData.time) {
      setError("Please select an appointment time.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter the reason for your visit.");
      return;
    }

    if (!user?.patientId) {
      setError("Patient account is not linked to a patient profile.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(apiUrl("/api/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: user.patientId,
          patientName: user.name || "",
          doctorId: formData.doctorId,
          doctorName: formData.doctorName,
          department: formData.department,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
          status: "confirmed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      setSuccess(
        "Appointment booked successfully! 📅"
      );

      setFormData({
        doctorId: "",
        doctorName: "",
        department: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError(
        err.message || "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

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
          Book Appointment
        </h1>

        <p className="mt-1 text-[var(--text-secondary)]">
          Schedule an appointment with a doctor.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <Card>
        <div className="space-y-6">
          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Select Doctor
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />

              <select
                value={formData.doctorId}
                onChange={(e) =>
                  handleDoctorChange(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none"
              >
                <option value="">
                  Choose a doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id || doctor.id}
                    value={doctor._id || doctor.id}
                  >
                    {doctor.name} â€”{" "}
                    {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Department
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              />

              <select
                value={formData.department}
                onChange={(e) =>
                  handleChange(
                    "department",
                    e.target.value
                  )
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] outline-none"
              >
                <option value="">
                  Select department
                </option>

                {departments.map((department) => (
                  <option
                    key={
                      department._id ||
                      department.id
                    }
                    value={
                      department.name ||
                      department.department
                    }
                  >
                    {department.name ||
                      department.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Appointment Date"
                type="date"
                value={formData.date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  handleChange(
                    "date",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Input
                label="Appointment Time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  handleChange(
                    "time",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Reason */}
          <Textarea
            label="Reason for Visit"
            placeholder="Describe why you want to see the doctor..."
            value={formData.reason}
            onChange={(e) =>
              handleChange(
                "reason",
                e.target.value
              )
            }
          />

          {/* Selected Doctor Summary */}
          {formData.doctorId && (
            <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Selected Doctor
              </p>

              <p className="font-semibold text-[var(--text-primary)] mt-1">
                {formData.doctorName}
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {formData.department}
              </p>
            </div>
          )}

          {/* Book Button */}
          <div className="flex justify-end">
            <Button
              icon={Calendar}
              onClick={handleBookAppointment}
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : "Book Appointment"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


