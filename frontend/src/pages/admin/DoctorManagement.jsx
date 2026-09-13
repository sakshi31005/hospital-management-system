import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Badge,
  SearchInput,
  Modal,
  Input,
  Select,
  Avatar,
  Pagination,
  Toast
} from '../../components/ui';

import {
  Plus,
  Edit,
  Trash2,
  Stethoscope,
  Star,
  Phone
} from 'lucide-react';
import { apiUrl } from "../../Api/Api";


const API_URL = apiUrl('/api/doctors');
const DEPARTMENT_API_URL = apiUrl('/api/departments');

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(true);

  const perPage = 6;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    specialization: '',
    experience: '',
    phone: ''
  });

  // =========================
  // GET DOCTORS
  // =========================

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();

      setDoctors(data);
    } catch (error) {
      console.error(error);

      setToast({
        message: 'Unable to load doctors',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET DEPARTMENTS
  // =========================

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${DEPARTMENT_API_URL}`);

      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }

      const data = await response.json();

      setDepartments(data);
    } catch (error) {
      console.error(error);

      setToast({
        message: 'Unable to load departments',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // ADD DOCTOR
  // =========================

  const handleAdd = () => {
    setEditDoctor(null);

    setFormData({
      name: '',
      email: '',
      department: '',
      specialization: '',
      experience: '',
      phone: ''
    });

    setShowModal(true);
  };

  // =========================
  // EDIT DOCTOR
  // =========================

  const handleEdit = (doctor) => {
    setEditDoctor(doctor);

    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      department: doctor.department || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      phone: doctor.phone || ''
    });

    setShowModal(true);
  };

  // =========================
  // SAVE DOCTOR
  // =========================

  const handleSave = async () => {
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.department ||
        !formData.specialization ||
        !formData.experience ||
        !formData.phone
      ) {
        setToast({
          message: 'Please fill all fields',
          type: 'error'
        });

        return;
      }

      const doctorData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        phone: formData.phone
      };

      // =========================
      // UPDATE
      // =========================

      if (editDoctor) {
        const doctorId = editDoctor._id || editDoctor.id;

        const response = await fetch(`${API_URL}/${doctorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(doctorData)
        });

        const updatedDoctor = await response.json();

        if (!response.ok) {
          throw new Error(updatedDoctor.message || 'Failed to update doctor');
        }

        setDoctors((prev) =>
          prev.map((doctor) =>
            (doctor._id || doctor.id) === doctorId
              ? updatedDoctor
              : doctor
          )
        );

        setToast({
          message: 'Doctor updated successfully',
          type: 'success'
        });
      }

      // =========================
      // ADD
      // =========================

      else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(doctorData)
        });

        const newDoctor = await response.json();

        if (!response.ok) {
          throw new Error(newDoctor.message || 'Failed to add doctor');
        }

        setDoctors((prev) => [newDoctor, ...prev]);

        setToast({
          message: 'Doctor added successfully',
          type: 'success'
        });
      }

      setShowModal(false);
    } catch (error) {
      console.error(error);

      setToast({
        message: error.message || 'Something went wrong',
        type: 'error'
      });
    }
  };

  // =========================
  // DELETE DOCTOR
  // =========================

  const handleDelete = async (doctor) => {
    const doctorId = doctor._id || doctor.id;

    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${doctor.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${doctorId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete doctor');
      }

      setDoctors((prev) =>
        prev.filter(
          (item) => (item._id || item.id) !== doctorId
        )
      );

      setToast({
        message: `${doctor.name} removed successfully`,
        type: 'success'
      });
    } catch (error) {
      console.error(error);

      setToast({
        message: error.message || 'Unable to delete doctor',
        type: 'error'
      });
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filtered = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.specialization?.toLowerCase().includes(searchText) ||
      doctor.department?.toLowerCase().includes(searchText);

    const matchDept =
      filterDept === 'all' ||
      doctor.department === filterDept;

    return matchSearch && matchDept;
  });

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const paginatedDoctors = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // =========================
  // RETURN UI
  // =========================

  return (
    <div id="doctor-management-page" className="space-y-6">

      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Doctor Management
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            Manage all doctors and their information
          </p>
        </div>

        <Button
          id="add-doctor-btn"
          icon={Plus}
          onClick={handleAdd}
        >
          Add Doctor
        </Button>

      </div>

      {/* FILTERS */}

      <Card padding="p-4">

        <div className="flex flex-col md:flex-row gap-3">

          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Search doctors..."
            className="flex-1"
          />

          <Select
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              {
                value: 'all',
                label: 'All Departments'
              },
              ...departments.map((d) => ({
                value: d.name,
                label: d.name
              }))
            ]}
          />

        </div>

      </Card>

      {/* LOADING */}

      {loading && (
        <div className="text-center py-10 text-[var(--text-secondary)]">
          Loading doctors...
        </div>
      )}

      {/* EMPTY */}

      {!loading && paginatedDoctors.length === 0 && (
        <Card padding="p-8">
          <div className="text-center text-[var(--text-secondary)]">
            No doctors found.
          </div>
        </Card>
      )}

      {/* DOCTOR CARDS */}

      {!loading && paginatedDoctors.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {paginatedDoctors.map((doc, i) => (

            <Card
              key={doc._id || doc.id}
              hover
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 80}ms`
              }}
            >

              {/* TOP */}

              <div className="flex items-start justify-between mb-4">

                <div className="flex items-center gap-3">

                  <Avatar
                    name={doc.name}
                    size="lg"
                  />

                  <div>

                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {doc.name}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)]">
                      {doc.specialization}
                    </p>

                  </div>

                </div>

                <Badge
                  variant={
                    doc.status === 'active'
                      ? 'success'
                      : 'warning'
                  }
                  dot
                  size="xs"
                >
                  {doc.status === 'active'
                    ? 'Active'
                    : 'On Leave'}
                </Badge>

              </div>

              {/* INFORMATION */}

              <div className="space-y-2 mb-4">

                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Stethoscope size={14} />
                  {doc.department}
                </div>

                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Star size={14} />
                  {doc.rating || 0} rating · {doc.experience} yrs exp
                </div>

                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Phone size={14} />
                  {doc.phone}
                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(doc)}
                  className="flex-1"
                >
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(doc)}
                  className="text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                />

              </div>

            </Card>

          ))}

        </div>

      )}

      {/* PAGINATION */}

      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* ADD / EDIT MODAL */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          editDoctor
            ? 'Edit Doctor'
            : 'Add New Doctor'
        }
        size="lg"

        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSave}>
              {editDoctor
                ? 'Update'
                : 'Add Doctor'}
            </Button>
          </>
        }
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Dr. Full Name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="doctor@hospital.com"
          />

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            options={[
              {
                value: '',
                label: 'Select Department'
              },
              ...departments.map((d) => ({
                value: d.name,
                label: d.name
              }))
            ]}
          />

          <Input
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="e.g. Cardiologist"
          />

          <Input
            label="Experience (years)"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="10"
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+91 xxxxxxxxxx"
          />

        </div>

      </Modal>

    </div>
  );
}
