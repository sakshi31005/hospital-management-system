import { useEffect, useState } from "react";

function PrescriptionManagement() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [formData, setFormData] = useState({
        doctorId: "",
        patientId: "",
        appointmentId: "",
        diagnosis: "",
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        followUp: "",
    });

    // -----------------------------
    // Fetch doctors, patients,
    // and appointments
    // -----------------------------
    useEffect(() => {
        fetchDoctors();
        fetchPatients();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await fetch("/api/doctors");

            if (!response.ok) {
                throw new Error("Failed to fetch doctors");
            }

            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await fetch("/api/patients");

            if (!response.ok) {
                throw new Error("Failed to fetch patients");
            }

            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch("/api/appointments");

            if (!response.ok) {
                throw new Error("Failed to fetch appointments");
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // -----------------------------
    // Handle form changes
    // -----------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        // When appointment is selected
        if (name === "appointmentId") {
            const selectedAppointment = appointments.find(
                (appointment) => appointment._id === value
            );

            if (selectedAppointment) {
                setFormData({
                    ...formData,

                    appointmentId: selectedAppointment._id,

                    // Automatically get IDs from appointment
                    patientId: selectedAppointment.patientId,
                    doctorId: selectedAppointment.doctorId,
                });
            } else {
                setFormData({
                    ...formData,
                    appointmentId: "",
                    patientId: "",
                    doctorId: "",
                });
            }

            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // -----------------------------
    // Find names for display
    // -----------------------------
    const selectedPatient = patients.find(
        (patient) => patient._id === formData.patientId
    );

    const selectedDoctor = doctors.find(
        (doctor) => doctor._id === formData.doctorId
    );

    // -----------------------------
    // Submit prescription
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.appointmentId ||
            !formData.patientId ||
            !formData.doctorId ||
            !formData.diagnosis ||
            !formData.medicationName ||
            !formData.dosage ||
            !formData.frequency ||
            !formData.duration
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const prescriptionData = {
            doctorId: formData.doctorId,
            patientId: formData.patientId,
            appointmentId: formData.appointmentId,

            diagnosis: formData.diagnosis,

            medications: [
                {
                    name: formData.medicationName,
                    dosage: formData.dosage,
                    frequency: formData.frequency,
                    duration: formData.duration,
                },
            ],

            instructions: formData.instructions,
            followUp: formData.followUp || undefined,
        };

        console.log("Prescription data:", prescriptionData);

        try {
            const response = await fetch("/api/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(prescriptionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create prescription"
                );
            }

            console.log("Prescription created:", data);

            alert("Prescription created successfully! 💊");

            // Reset form
            setFormData({
                doctorId: "",
                patientId: "",
                appointmentId: "",
                diagnosis: "",
                medicationName: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
                followUp: "",
            });
        } catch (error) {
            console.error("Error creating prescription:", error);
            alert(error.message);
        }
    };

    return (
        <div className="p-6 space-y-6">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    Prescription Management 💊
                </h1>

                <p className="mt-2 text-[var(--text-secondary)]">
                    Create a prescription for a patient.
                </p>
            </div>

            {/* Prescription Form */}
            <form
                onSubmit={handleSubmit}
                className="card p-6 space-y-5"
            >

                {/* ========================= */}
                {/* Appointment */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Appointment
                    </label>

                    <select
                        name="appointmentId"
                        value={formData.appointmentId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">
                            Select Appointment
                        </option>

                        {appointments.map((appointment) => (
                            <option
                                key={appointment._id}
                                value={appointment._id}
                            >
                                {appointment.patientName} -{" "}
                                {appointment.doctorName} -{" "}
                                {appointment.date} -{" "}
                                {appointment.time}
                            </option>
                        ))}
                    </select>
                </div>
                {/* ========================= */}
                {/* Patient */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Patient
                    </label>

                    <select
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">
                            Select Patient
                        </option>

                        {patients.map((patient) => (
                            <option
                                key={patient._id}
                                value={patient._id}
                            >
                                {patient.name}
                            </option>
                        ))}
                    </select>

                    {formData.patientId && (
                        <p className="text-xs text-gray-500 mt-1">
                            Patient ID: {formData.patientId}
                        </p>
                    )}
                </div>


                {/* ========================= */}
                {/* Doctor */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Doctor
                    </label>

                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">
                            Select Doctor
                        </option>

                        {doctors.map((doctor) => (
                            <option
                                key={doctor._id}
                                value={doctor._id}
                            >
                                {doctor.name}
                            </option>
                        ))}
                    </select>

                    {formData.doctorId && (
                        <p className="text-xs text-gray-500 mt-1">
                            Doctor ID: {formData.doctorId}
                        </p>
                    )}
                </div>

                {/* ========================= */}
                {/* Diagnosis */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Diagnosis
                    </label>

                    <input
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        placeholder="Enter diagnosis"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* ========================= */}
                {/* Medication */}
                {/* ========================= */}

                <div className="border-t pt-5">

                    <h2 className="text-xl font-semibold mb-4">
                        Medication 💊
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Medicine Name */}
                        <input
                            type="text"
                            name="medicationName"
                            value={formData.medicationName}
                            onChange={handleChange}
                            placeholder="Medicine name"
                            required
                            className="px-4 py-2 border rounded-lg"
                        />

                        {/* Dosage */}
                        <input
                            type="text"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            placeholder="Dosage e.g. 500mg"
                            required
                            className="px-4 py-2 border rounded-lg"
                        />

                        {/* Frequency */}
                        <input
                            type="text"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            placeholder="Frequency e.g. Twice a day"
                            required
                            className="px-4 py-2 border rounded-lg"
                        />

                        {/* Duration */}
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Duration e.g. 5 days"
                            required
                            className="px-4 py-2 border rounded-lg"
                        />

                    </div>
                </div>

                {/* ========================= */}
                {/* Instructions */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Instructions
                    </label>

                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="Enter instructions for patient"
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* ========================= */}
                {/* Follow-up */}
                {/* ========================= */}

                <div>
                    <label className="block mb-2 font-medium">
                        Follow-up Date
                    </label>

                    <input
                        type="date"
                        name="followUp"
                        value={formData.followUp}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* ========================= */}
                {/* Submit */}
                {/* ========================= */}

                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Prescription 💊
                </button>

            </form>
        </div>
    );
}

export default PrescriptionManagement;