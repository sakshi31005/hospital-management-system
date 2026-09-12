import { useEffect, useState } from "react";
import { Calendar, Search, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DoctorAppointments = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/appointments");

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      const doctorAppointments = data.filter(
        (appointment) =>
          appointment.doctorId === user?.doctorId ||
          appointment.doctorId === user?.id
      );

      setAppointments(doctorAppointments);
    } catch (err) {
      console.error(err);
      setError("Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Local date in YYYY-MM-DD
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = appointment.date;

    let matchesTab = true;

    if (activeTab === "today") {
      matchesTab = appointmentDate === today;
    }

    if (activeTab === "upcoming") {
      matchesTab = appointmentDate > today;
    }

    if (activeTab === "past") {
      matchesTab = appointmentDate < today;
    }

    if (activeTab === "all") {
      matchesTab = true;
    }

    const searchText = search.toLowerCase();

    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(searchText) ||
      appointment.department?.toLowerCase().includes(searchText) ||
      appointment.reason?.toLowerCase().includes(searchText) ||
      appointment.status?.toLowerCase().includes(searchText);

    return matchesTab && matchesSearch;
  });

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      await fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Unable to update appointment");
    }
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Calendar className="w-7 h-7 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Appointments
            </h1>

            <p className="text-gray-500">
              Manage appointments with your patients
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search patient, department, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {["today", "upcoming", "past", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg font-medium capitalize transition ${activeTab === tab
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />

          <h3 className="text-lg font-semibold text-gray-700">
            No appointments found
          </h3>

          <p className="text-gray-500 mt-1">
            There are no appointments for this section.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Patient
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Time
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Department
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Reason
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {appointment.patientName}
                      </div>

                      <div className="text-xs text-gray-400">
                        ID: {appointment.patientId || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {appointment.date}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {appointment.time}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {appointment.department || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {appointment.reason || "General consultation"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {(appointment.status === "waiting" ||
                        appointment.status === "confirmed") && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus(appointment._id, "completed")
                              }
                              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                              title="Complete"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(appointment._id, "cancelled")
                              }
                              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                      {appointment.status !== "waiting" &&
                        appointment.status !== "confirmed" && (
                            <span className="text-sm text-gray-400">
                            No action
                          </span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;