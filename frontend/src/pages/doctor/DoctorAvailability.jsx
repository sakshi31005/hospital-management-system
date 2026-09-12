import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Edit } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DoctorAvailability = () => {
    const { user } = useAuth();

    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        day: "Monday",
        startTime: "",
        endTime: "",
    });

    const fetchAvailability = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/doctor-availability/doctor/${user?.doctorId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch availability");
            }

            const data = await response.json();
            setAvailability(data);
        } catch (error) {
            console.error("Error fetching availability:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.doctorId) {
            fetchAvailability();
        }
    }, [user]);

    const handleSave = async () => {
        if (!formData.startTime || !formData.endTime) {
            alert("Please select start time and end time");
            return;
        }

        if (formData.startTime >= formData.endTime) {
            alert("End time must be after start time");
            return;
        }

        try {
            const url = editingId
                ? `/api/doctor-availability/${editingId}`
                : "/api/doctor-availability";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId: user.doctorId,
                    doctorName: user.name,
                    day: formData.day,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    status: "available",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save availability");
            }

            await fetchAvailability();

            setFormData({
                day: "Monday",
                startTime: "",
                endTime: "",
            });

            setEditingId(null);
            setShowForm(false);

            alert(
                editingId
                    ? "Availability updated successfully!"
                    : "Availability added successfully!"
            );
        } catch (error) {
            console.error("Error saving availability:", error);
            alert("Unable to save availability");
        }
    };


    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this availability?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `/api/doctor-availability/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete availability");
            }

            await fetchAvailability();

            alert("Availability deleted successfully!");
        } catch (error) {
            console.error("Error deleting availability:", error);
            alert("Unable to delete availability");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
        });

        setShowForm(true);
    };

    const handleToggleStatus = async (item) => {
        try {
            const newStatus =
                item.status === "available" ? "unavailable" : "available";

            const response = await fetch(
                `/api/doctor-availability/${item._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        doctorId: item.doctorId,
                        doctorName: item.doctorName,
                        day: item.day,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            await fetchAvailability();
        } catch (error) {
            console.error("Error updating availability status:", error);
            alert("Unable to update availability status");
        }
    };
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Doctor Availability</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your weekly availability
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus size={18} />
                    Add Availability
                </button>
            </div>

            {showForm && (
                <div className="mb-6 border rounded-xl p-5 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingId ? "Edit Availability" : "Add Availability"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Day */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Day
                            </label>

                            <select
                                value={formData.day}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        day: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                            </select>
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Start Time
                            </label>

                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        startTime: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                End Time
                            </label>

                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        endTime: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Save Availability
                        </button>

                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : availability.length === 0 ? (
                <div className="text-center py-12 border rounded-xl">
                    <Clock className="mx-auto mb-3 text-gray-400" size={40} />

                    <h2 className="text-lg font-semibold">
                        No availability added
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Add your available days and working hours.
                    </p>
                </div>
            ) : (
                <div>
                    {availability.map((item) => (
                        <div
                            key={item._id}
                            className="border rounded-xl p-4 mb-3 flex justify-between"
                        >
                            <div>
                                <h3 className="font-semibold">{item.day}</h3>
                                <p className="text-gray-500">
                                    {item.startTime} - {item.endTime}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggleStatus(item)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "available"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.status === "available" ? "Available" : "Unavailable"}
                                </button>

                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorAvailability;