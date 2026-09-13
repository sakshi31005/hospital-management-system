import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FlaskConical, Plus, Search } from "lucide-react";
import { Card, Button, Input, Spinner } from "../../components/ui";

const LabReports = () => {
    const { user } = useAuth();

    const [reports, setReports] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",
        testName: "",
        testType: "",
        result: "",
        normalRange: "",
        status: "pending",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                reportsResponse,
                patientsResponse,
                appointmentsResponse,
            ] = await Promise.all([
                fetch(apiUrl("/api/lab-reports")),
                fetch(apiUrl("/api/patients")),
                fetch(apiUrl("/api/appointments")),
            ]);

            if (
                !reportsResponse.ok ||
                !patientsResponse.ok ||
                !appointmentsResponse.ok
            ) {
                throw new Error("Failed to fetch data");
            }

            const reportsData = await reportsResponse.json();
            const patientsData = await patientsResponse.json();
            const appointmentsData = await appointmentsResponse.json();

            setReports(reportsData);
            setPatients(patientsData);
            setAppointments(appointmentsData);
        } catch (err) {
            console.error(err);
            setError("Unable to load lab reports");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !formData.patientId ||
            !formData.testName ||
            !formData.result
        ) {
            setError("Please fill in patient, test name and result");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const selectedPatient = patients.find(
                (patient) => patient._id === formData.patientId
            );

            const response = await fetch(apiUrl("/api/lab-reports"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patientId: formData.patientId,
                    patientName: selectedPatient?.name || "",
                    doctorId: user?.doctorId || "",
                    doctorName: user?.name || "",
                    testName: formData.testName,
                    testType: formData.testType,
                    result: formData.result,
                    normalRange: formData.normalRange,
                    status: formData.status,
                    notes: formData.notes,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create lab report"
                );
            }

            setReports((prev) => [data, ...prev]);

            setFormData({
                patientId: "",
                testName: "",
                testType: "",
                result: "",
                normalRange: "",
                status: "pending",
                notes: "",
            });

            setShowForm(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // Find patients who have appointments with the logged-in doctor
    const myPatientIds = [
        ...new Set(
            appointments
                .filter(
                    (appointment) =>
                        appointment.doctorId === user?.doctorId
                )
                .map((appointment) => appointment.patientId)
        ),
    ];

    const myPatients = patients.filter((patient) =>
        myPatientIds.includes(patient._id)
    );

    // Search reports
    const filteredReports = reports.filter((report) => {
        const text = search.toLowerCase();

        return (
            report.patientName?.toLowerCase().includes(text) ||
            report.testName?.toLowerCase().includes(text)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Lab Reports
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Create and manage patient lab reports
                    </p>
                </div>

                <Button
                    icon={Plus}
                    onClick={() => {
                        setError("");
                        setShowForm(true);
                    }}
                >
                    Create Lab Report
                </Button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600">
                    {error}
                </div>
            )}

            {/* Search */}
            <Card className="p-4">
                <Input
                    placeholder="Search patient or test..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={Search}
                />
            </Card>

            {/* Reports */}
            {filteredReports.length === 0 ? (
                <Card className="p-10 text-center">
                    <FlaskConical
                        className="mx-auto mb-3 text-gray-400"
                        size={40}
                    />

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        No lab reports found
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Lab reports created for your patients will appear here.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filteredReports.map((report) => (
                        <Card key={report._id} className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {report.testName}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Patient: {report.patientName}
                                    </p>

                                    {report.doctorName && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Doctor: {report.doctorName}
                                        </p>
                                    )}
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        report.status === "normal"
                                            ? "bg-green-100 text-green-700"
                                            : report.status === "abnormal"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {report.status}
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <p>
                                    <span className="font-medium">
                                        Test Type:
                                    </span>{" "}
                                    {report.testType || "â€”"}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Result:
                                    </span>{" "}
                                    {report.result}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Normal Range:
                                    </span>{" "}
                                    {report.normalRange || "â€”"}
                                </p>

                                {report.notes && (
                                    <p>
                                        <span className="font-medium">
                                            Notes:
                                        </span>{" "}
                                        {report.notes}
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Report Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Create Lab Report
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Enter the patient's laboratory result
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"
                            >
                                Ã—
                            </button>
                        </div>

                        <form
                            onSubmit={handleSave}
                            className="space-y-4"
                        >
                            {/* Patient */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Patient
                                </label>

                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                                >
                                    <option value="">
                                        Select patient
                                    </option>

                                    {myPatients.map((patient) => (
                                        <option
                                            key={patient._id}
                                            value={patient._id}
                                        >
                                            {patient.name}
                                        </option>
                                    ))}
                                </select>

                                {myPatients.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        No patients with appointments assigned
                                        to you.
                                    </p>
                                )}
                            </div>

                            {/* Test name */}
                            <Input
                                label="Test Name"
                                name="testName"
                                placeholder="e.g. Complete Blood Count"
                                value={formData.testName}
                                onChange={handleChange}
                            />

                            {/* Test type */}
                            <Input
                                label="Test Type"
                                name="testType"
                                placeholder="e.g. Blood Test"
                                value={formData.testType}
                                onChange={handleChange}
                            />

                            {/* Result */}
                            <Input
                                label="Result"
                                name="result"
                                placeholder="Enter test result"
                                value={formData.result}
                                onChange={handleChange}
                            />

                            {/* Normal range */}
                            <Input
                                label="Normal Range"
                                name="normalRange"
                                placeholder="e.g. 4.5 - 5.5 million/ÂµL"
                                value={formData.normalRange}
                                onChange={handleChange}
                            />

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                                >
                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="normal">
                                        Normal
                                    </option>

                                    <option value="abnormal">
                                        Abnormal
                                    </option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="Additional notes..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        saving || myPatients.length === 0
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Report"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabReports;



