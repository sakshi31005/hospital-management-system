import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Input, Toast } from "../../components/ui";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
} from "lucide-react";

export default function RegisterForm({ onSuccess, onLogin }) {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Patient fields
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [department, setDepartment] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [experience, setExperience] = useState("");
    const [role, setRole] = useState("patient");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!name || !email || !password) {
            setError("Please fill all required fields.");
            return;
        }

        // Patient validation
        if (role === "patient") {
            if (
                !age ||
                !gender ||
                !address ||
                !phone ||
                !bloodGroup
            ) {
                setError("Please fill all patient details.");
                return;
            }
        }

        if (role === "doctor") {
            if (
                !department ||
                !specialization ||
                !experience ||
                !phone
            ) {
                setError("Please fill all doctor details.");
                return;
            }
        }

        setLoading(true);

        try {
            const result = await register(
                name,
                email,
                password,
                role,
                {
                    age,
                    gender,
                    address,
                    phone,
                    bloodGroup,
                    department,
                    specialization,
                    experience,
                }
            );

            if (!result.success) {
                setError(result.error);
                return;
            }

            setToast({
                message: "Account created successfully!",
                type: "success",
            });

            setTimeout(() => {
                onSuccess?.();
            }, 800);
        } catch (error) {
            console.error("Registration error:", error);
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Toast */}
            {toast && (
                <Toast
                    {...toast}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    Create Account
                </h2>

                <p className="text-[var(--text-secondary)] text-sm">
                    Create your hospital portal account
                </p>
            </div>

            {/* Registration Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Name */}
                <Input
                    id="register-name"
                    label="Full Name"
                    type="text"
                    icon={User}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* Email */}
                <Input
                    id="register-email"
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* Password */}
                <div className="relative">
                    <Input
                        id="register-password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        icon={Lock}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-9 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {/* Account Type */}
                <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                        Select Account Type
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {/* Doctor */}
                        <button
                            type="button"
                            onClick={() => handleRoleChange("doctor")}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${role === "doctor"
                                ? "border-primary-500 bg-primary-50 text-primary-600"
                                : "border-gray-200 hover:border-primary-300 text-[var(--text-primary)]"
                                }`}
                        >
                            👨‍⚕️ Doctor
                        </button>

                        {/* Receptionist */}
                        <button
                            type="button"
                            onClick={() =>
                                handleRoleChange("receptionist")
                            }
                            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${role === "receptionist"
                                ? "border-primary-500 bg-primary-50 text-primary-600"
                                : "border-gray-200 hover:border-primary-300 text-[var(--text-primary)]"
                                }`}
                        >
                            💼 Receptionist
                        </button>

                        {/* Patient */}
                        <button
                            type="button"
                            onClick={() => handleRoleChange("patient")}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${role === "patient"
                                ? "border-primary-500 bg-primary-50 text-primary-600"
                                : "border-gray-200 hover:border-primary-300 text-[var(--text-primary)]"
                                }`}
                        >
                            🧑 Patient
                        </button>
                    </div>
                </div>

                {/* Patient Details */}
                {role === "patient" && (
                    <div className="space-y-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                            Patient Details
                        </p>

                        {/* Age */}
                        <Input
                            id="register-age"
                            label="Age"
                            type="number"
                            icon={Calendar}
                            placeholder="Enter your age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Gender
                            </label>

                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500"
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <Input
                            id="register-phone"
                            label="Phone Number"
                            type="tel"
                            icon={Phone}
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        {/* Address */}
                        <Input
                            id="register-address"
                            label="Address"
                            type="text"
                            icon={MapPin}
                            placeholder="Enter your address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Blood Group
                            </label>

                            <select
                                value={bloodGroup}
                                onChange={(e) =>
                                    setBloodGroup(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500"
                                required
                            >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>
                )}


                {role === "doctor" && (
                    <div className="space-y-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                            Doctor Details
                        </p>

                        {/* Department */}
                        <Input
                            id="register-department"
                            label="Department"
                            type="text"
                            icon={Briefcase}
                            placeholder="e.g. Cardiology"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        />

                        {/* Specialization */}
                        <Input
                            id="register-specialization"
                            label="Specialization"
                            type="text"
                            icon={Briefcase}
                            placeholder="e.g. Cardiologist"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            required
                        />

                        {/* Experience */}
                        <Input
                            id="register-experience"
                            label="Experience (Years)"
                            type="number"
                            icon={Calendar}
                            placeholder="e.g. 5"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                        />

                        {/* Phone */}
                        <Input
                            id="register-doctor-phone"
                            label="Phone Number"
                            type="tel"
                            icon={Phone}
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Create Account */}
                <Button
                    id="register-submit"
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                >
                    Create Account
                </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onLogin}
                    className="text-primary-500 font-semibold hover:underline cursor-pointer"
                >
                    Sign In
                </button>
            </p>

            {/* Footer */}
            <p className="text-center text-xs text-[var(--text-tertiary)] mt-4">
                Built with React, Node.js, Express &amp; MongoDB
            </p>
        </div>
    );
}