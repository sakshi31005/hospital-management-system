import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { Card, Button, Input, Toast } from "../../components/ui";
import { CalendarPlus } from "lucide-react";

export default function BookAppointment() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(apiUrl("/api/patients"));
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(apiUrl("/api/doctors"));
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !doctorId || !date || !time) {
      setToast({
        message: "Please fill all required fields",
        type: "danger",
      });
      return;
    }

    const selectedPatient = patients.find(
      (patient) => patient._id === patientId
    );

    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === doctorId
    );

    try {
      setLoading(true);

      const appointmentData = {
        patientId,
        patientName: selectedPatient?.name || "",
        doctorId,
        doctorName: selectedDoctor?.name || "",
        department: selectedDoctor?.department || "",
        date,
        time,
        reason,
        status: "confirmed",
      };

      const response = await fetch(apiUrl("/api/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to book appointment");
      }

      setToast({
        message: "Appointment booked successfully ðŸŽ‰",
        type: "success",
      });

      setPatientId("");
      setDoctorId("");
      setDate("");
      setTime("");
      setReason("");
    } catch (error) {
      console.error("Error booking appointment:", error);

      setToast({
        message: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Book Appointment</h1>
        <p className="text-gray-500">
          Schedule a new appointment for a patient
        </p>
      </div>

      <Card className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500">
            <CalendarPlus size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              New Appointment
            </h2>
            <p className="text-sm text-gray-500">
              Enter appointment details below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient *
            </label>

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-transparent"
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Doctor *
            </label>

            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-transparent"
            >
              <option value="">Select Doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} â€” {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium mb-2">
                Date *
              </label>

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Time *
              </label>

              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reason / Symptoms
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for appointment..."
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-transparent"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading}>
              <CalendarPlus size={18} className="mr-2" />

              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>

        </form>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}


