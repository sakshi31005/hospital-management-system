import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardLayout } from "./components/layout";
import { Spinner } from "./components/ui";

// Landing / Auth
import Hero from "./pages/landing/Hero";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorManagement from "./pages/admin/DoctorManagement";
import PatientManagement from "./pages/admin/PatientManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import BillingManagement from "./pages/admin/BillingManagement";
import BedManagement from "./pages/admin/BedManagement";
import LabManagement from "./pages/admin/LabManagement";
import ReportsPage from "./pages/admin/ReportsPage";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PrescriptionManagement from "./pages/doctor/PrescriptionManagement";
import MyPatients from "./pages/doctor/MyPatients";
import LabReports from "./pages/doctor/LabReports";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Receptionist Pages
import ReceptionDashboard from "./pages/receptionist/ReceptionDashboard";
import RegisterPatient from "./pages/receptionist/RegisterPatient";
import BookAppointment from "./pages/receptionist/BookAppointment";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientPrescriptionManagement from "./pages/patient/PrescriptionManagement";
import PatientLabReports from "./pages/patient/PatientLabReports";
import PatientBills from "./pages/patient/MyBills";
import SymptomAssistant from "./pages/patient/SymptomAssistant";
import MedicalHistory from "./pages/patient/MedicalHistory";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientBed from "./pages/patient/MyBed";

// ===== Protected Route Wrapper =====
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their own dashboard
    const roleRoutes = {
      admin: "/admin",
      doctor: "/doctor",
      receptionist: "/reception",
      patient: "/patient",
    };
    return <Navigate to={roleRoutes[user.role] || "/"} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

// ===== Placeholder page for sub-routes that share a dashboard =====
function SubPage({ title, description }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
      <p className="text-[var(--text-secondary)]">{description}</p>
      <div className="card p-8 text-center">
        <p className="text-[var(--text-secondary)]">
          This section is available in the main dashboard view.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page — Sign In opens as a modal on top of the hero */}
            <Route path="/" element={<Hero />} />
            {/* Kept for backward-compatible / bookmarked links: shows the same
                landing page with the login modal already open */}
            <Route path="/login" element={<Hero autoOpenLogin />} />

            {/* ===== ADMIN ROUTES ===== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PatientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DepartmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/beds"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BedManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/lab"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LabManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* ===== DOCTOR ROUTES ===== */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <MyPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <PrescriptionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/lab"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <LabReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/availability"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
        

            {/* ===== RECEPTIONIST ROUTES ===== */}
            <Route
              path="/reception"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <ReceptionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/register"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <RegisterPatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/book"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/appointments"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/patients"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <PatientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/billing"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <BillingManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception/doctors"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reception/beds"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <BedManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reception/lab"
              element={
                <ProtectedRoute allowedRoles={["receptionist"]}>
                  <LabManagement />
                </ProtectedRoute>
              }
            />
          

            {/* ===== PATIENT ROUTES ===== */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
              <PatientBookAppointment/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/prescriptions"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientPrescriptionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/lab"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientLabReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/bills"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientBills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/history"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <MedicalHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/assistant"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <SymptomAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/bed"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientBed />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-primary-500 mb-4">
                      404
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] mb-6">
                      Page not found
                    </p>
                    <a
                      href="/"
                      className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      Go to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
