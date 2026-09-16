import { apiUrl } from "../../Api/Api";
import { useState } from "react";

function RegisterPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(apiUrl("/api/patients"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register patient");
      }

      setMessage("Patient registered successfully! 🎉");

      setForm({
        name: "",
        age: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        bloodGroup: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Register Patient
        </h1>

        <p className="mt-1 text-[var(--text-secondary)]">
          Add a new patient to the hospital system.
        </p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Age
            </label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-lg border px-4 py-2.5"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Blood Group
            </label>

            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5"
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

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5"
              placeholder="Enter email"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full rounded-lg border px-4 py-2.5"
              placeholder="Enter patient address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPatient;

