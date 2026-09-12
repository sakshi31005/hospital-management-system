import { useEffect, useState } from "react";
import { UserCircle, Mail, Phone, Stethoscope, Briefcase, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DoctorProfile = () => {
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        specialization: "",
        experience: "",
    });

    const fetchDoctor = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/doctors");

            if (!response.ok) {
                throw new Error("Failed to fetch doctors");
            }

            const data = await response.json();

            const currentDoctor = data.find(
                (doctor) =>
                    doctor._id === user?.doctorId ||
                    doctor.id === user?.doctorId
            );

            setDoctor(currentDoctor || null);
        } catch (error) {
            console.error("Error fetching doctor:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.doctorId) {
            fetchDoctor();
        }
    }, [user]);

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    if (!doctor) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Doctor Profile</h1>
                <p className="mt-4 text-gray-500">
                    Doctor profile not found.
                </p>
            </div>
        );
    }

    const handleEdit = () => {
        setFormData({
            name: doctor.name || "",
            email: doctor.email || "",
            phone: doctor.phone || "",
            department: doctor.department || "",
            specialization: doctor.specialization || "",
            experience: doctor.experience || "",
        });

        setEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/doctors/${doctor._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    department: formData.department,
                    specialization: formData.specialization,
                    experience: Number(formData.experience),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update doctor");
            }

            const updatedDoctor = await response.json();

            setDoctor(updatedDoctor);
            setEditing(false);

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Unable to update profile");
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Doctor Profile</h1>
                    <p className="text-gray-500 mt-1">
                        View your professional information
                    </p>
                </div>

                <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Edit Profile
                </button>
            </div>
            {editing && (
                <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold mb-5">
                        Edit Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        department: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Specialization
                            </label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        specialization: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Experience
                            </label>
                            <input
                                type="number"
                                value={formData.experience}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experience: e.target.value,
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
                            Save Changes
                        </button>

                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}
            <div className="bg-white border rounded-xl p-6 shadow-sm">

                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-indigo-100 rounded-full">
                        <UserCircle size={50} className="text-indigo-600" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            {doctor.name}
                        </h2>

                        <p className="text-gray-500">
                            {doctor.specialization}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="flex items-center gap-3">
                        <Mail className="text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{doctor.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{doctor.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Stethoscope className="text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{doctor.department}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Briefcase className="text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Experience</p>
                            <p className="font-medium">
                                {doctor.experience} years
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Star className="text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="font-medium">
                                {doctor.rating || 0}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">
                            Status
                        </p>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${doctor.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {doctor.status}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;