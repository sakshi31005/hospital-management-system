import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Users, UserCog, Calendar, Building2, BedDouble, Receipt, BarChart3,
  Stethoscope, ClipboardList, FlaskConical, FileText, Clock, UserCircle,
  CalendarPlus, UserPlus, CalendarCheck, CreditCard,
  Heart, TestTube, History, Bot,
  Menu, X, ChevronLeft, Sun, Moon, Bell, LogOut, Settings, Search, LayoutGrid
} from 'lucide-react';
import { Avatar } from '../ui';

const NOTIFICATIONS = [];

// ===== Navigation Config by Role =====
const NAV_CONFIG = {
  // ================= ADMIN =================
  admin: [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      id: 'admin-doctors',
      label: 'Doctors',
      path: '/admin/doctors',
      icon: Stethoscope,
    },
    {
      id: 'admin-patients',
      label: 'Patients',
      path: '/admin/patients',
      icon: Users,
    },
    {
      id: 'admin-appointments',
      label: 'Appointments',
      path: '/admin/appointments',
      icon: Calendar,
    },
    {
      id: 'admin-departments',
      label: 'Departments',
      path: '/admin/departments',
      icon: Building2,
    },
    {
      id: 'admin-beds',
      label: 'Beds / Rooms',
      path: '/admin/beds',
      icon: BedDouble,
    },
    {
      id: 'admin-lab',
      label: 'Lab Reports',
      path: '/admin/lab',
      icon: FlaskConical,
    },
    {
      id: 'admin-reports',
      label: 'Analytics',
      path: '/admin/reports',
      icon: BarChart3,
    },
  ],

  // ================= DOCTOR =================
  doctor: [
    {
      id: 'doctor-dashboard',
      label: 'Dashboard',
      path: '/doctor',
      icon: LayoutDashboard,
    },
    {
      id: 'doctor-appointments',
      label: 'Appointments',
      path: '/doctor/appointments',
      icon: Calendar,
    },
    {
      id: 'doctor-patients',
      label: 'My Patients',
      path: '/doctor/patients',
      icon: Users,
    },
    {
      id: 'doctor-prescriptions',
      label: 'Prescriptions',
      path: '/doctor/prescriptions',
      icon: ClipboardList,
    },
    {
      id: 'doctor-lab',
      label: 'Lab Reports',
      path: '/doctor/lab',
      icon: FlaskConical,
    },
    {
      id: 'doctor-availability',
      label: 'Availability',
      path: '/doctor/availability',
      icon: Clock,
    },
    {
      id: 'doctor-profile',
      label: 'Profile',
      path: '/doctor/profile',
      icon: UserCircle,
    },
  ],

  // ================= RECEPTIONIST =================
  receptionist: [
    {
      id: 'reception-dashboard',
      label: 'Dashboard',
      path: '/reception',
      icon: LayoutDashboard,
    },
    {
      id: 'reception-register',
      label: 'Register Patient',
      path: '/reception/register',
      icon: UserPlus,
    },
    {
      id: 'reception-book',
      label: 'Book Appointment',
      path: '/reception/book',
      icon: CalendarPlus,
    },
    {
      id: 'reception-appointments',
      label: 'Appointments',
      path: '/reception/appointments',
      icon: CalendarCheck,
    },
    {
      id: 'reception-patients',
      label: 'Patients',
      path: '/reception/patients',
      icon: Users,
    },
    {
      id: 'reception-doctors',
      label: 'Doctors',
      path: '/reception/doctors',
      icon: Stethoscope,
    },
    {
      id: 'reception-billing',
      label: 'Billing',
      path: '/reception/billing',
      icon: CreditCard,
    },
    {
      id: 'reception-beds',
      label: 'Beds / Rooms',
      path: '/reception/beds',
      icon: BedDouble,
    },
    {
      id: 'reception-lab',
      label: 'Lab Reports',
      path: '/reception/lab',
      icon: FlaskConical,
    }
  ],

  // ================= PATIENT =================
  patient: [
    {
      id: 'patient-dashboard',
      label: 'Dashboard',
      path: '/patient',
      icon: LayoutDashboard,
    },
    {
      id: 'patient-appointments',
      label: 'My Appointments',
      path: '/patient/appointments',
      icon: Calendar,
    },
    {
      id: 'patient-book',
      label: 'Book Appointment',
      path: '/patient/book',
      icon: CalendarPlus,
    },
    {
      id: 'patient-prescriptions',
      label: 'Prescriptions',
      path: '/patient/prescriptions',
      icon: ClipboardList,
    },
    {
      id: 'patient-lab',
      label: 'Lab Reports',
      path: '/patient/lab',
      icon: TestTube,
    },
    {
      id: 'patient-bills',
      label: 'My Bills',
      path: '/patient/bills',
      icon: Receipt,
    },
    {
      id: 'patient-bed',
      label: 'My Bed / Room',
      path: '/patient/bed',
      icon: BedDouble,
    },
    {
      id: 'patient-history',
      label: 'Medical History',
      path: '/patient/history',
      icon: History,
    },
    {
      id: 'patient-ai',
      label: 'Health Assistant',
      path: '/patient/assistant',
      icon: Bot,
    },
    {
      id: 'patient-profile',
      label: 'Profile',
      path: '/patient/profile',
      icon: UserCircle,
    },
  ],
};

const ROLE_LABELS = {
  admin: 'Admin Panel',
  doctor: 'Doctor Portal',
  receptionist: 'Reception Desk',
  patient: 'Patient Portal',
};

const ROLE_HOME = {
  admin: '/admin',
  doctor: '/doctor',
  receptionist: '/reception',
  patient: '/patient',
};

const ROLE_COLORS = {
  admin: 'from-primary-600 to-primary-800',
  doctor: 'from-teal-600 to-teal-800',
  receptionist: 'from-purple-600 to-purple-800',
  patient: 'from-rose-600 to-rose-800',
};

// ===== Sidebar =====
export function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_CONFIG[user?.role] || [];
  const roleLabel = ROLE_LABELS[user?.role] || 'Portal';
  const roleColor = ROLE_COLORS[user?.role] || 'from-primary-600 to-primary-800';
  const roleHome = ROLE_HOME[user?.role] || '/';

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onToggle} />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-screen z-40 flex flex-col bg-[var(--bg-sidebar)]
          transition-all duration-300 ease-in-out
          ${collapsed ? '-translate-x-full w-72 lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72 lg:w-72'}`}
      >
        {/* Logo / Brand */}
        <button
          onClick={() => navigate(roleHome)}
          className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 bg-gradient-to-r ${roleColor} cursor-pointer text-left`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Heart size={22} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden min-w-0">
              <h1 className="text-base font-bold text-white leading-tight truncate">MediCare HMS</h1>
              <p className="text-xs text-white/70 truncate">{roleLabel}</p>
            </div>
          )}
          {/* Close button on mobile */}
          <span onClick={(e) => { e.stopPropagation(); onToggle(); }} className="ml-auto lg:hidden p-1 text-white/70 hover:text-white cursor-pointer">
            <X size={20} />
          </span>
        </button>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              id={item.id}
              to={item.path}
              end={item.path === `/${user?.role}` || item.path === '/admin' || item.path === '/reception'}
              onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${collapsed ? 'lg:justify-center' : ''}
                ${isActive
                  ? 'bg-[var(--bg-sidebar-active)] text-[var(--text-sidebar-active)] shadow-lg shadow-primary-500/20'
                  : 'text-[var(--text-sidebar)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-sidebar-active)]'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0 transition-transform group-hover:scale-110" />
              <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="p-4 border-t border-white/10">
            <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
              <Avatar name={user.name} size="sm" />
              <div className={`overflow-hidden min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-white/50 truncate capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

// ===== Navbar =====
export function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const roleHome = ROLE_HOME[user?.role] || '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      id="navbar"
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-[var(--bg-secondary)]/90 border-b border-[var(--border-color)] backdrop-blur-xl"
    >
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          id="menu-toggle"
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors cursor-pointer flex-shrink-0"
        >
          {sidebarCollapsed ? <Menu size={20} className="hidden lg:block" /> : <ChevronLeft size={20} className="hidden lg:block" />}
          <Menu size={20} className="lg:hidden" />
        </button>

        {/* Quick Overview / Dashboard shortcut */}
        <button
          id="quick-overview-btn"
          onClick={() => navigate(roleHome)}
          title="Go to overview dashboard"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex-shrink-0"
        >
          <LayoutGrid size={16} />
          <span className="hidden md:inline">Overview</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] max-w-xs">
          <Search size={16} className="text-[var(--text-tertiary)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none w-full min-w-0"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-all duration-300 cursor-pointer"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} className="text-warning-400" /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors relative cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] px-0.5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 w-80 max-w-[90vw] bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-color)] animate-scale-in overflow-hidden z-50">
                <div className="p-4 border-b border-[var(--border-color)]">
                  <h4 className="font-semibold text-[var(--text-primary)]">Notifications</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className={`px-4 py-3 border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <p className="text-sm text-[var(--text-primary)]">{notif.message}</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            id="profile-dropdown"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
          >
            <Avatar name={user?.name} size="sm" />
            <span className="hidden md:block text-sm font-medium text-[var(--text-primary)] max-w-[120px] truncate">{user?.name}</span>
          </button>
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-12 w-56 bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-color)] animate-scale-in overflow-hidden z-50">
                <div className="p-4 border-b border-[var(--border-color)]">
                  <p className="font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] cursor-pointer">
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ===== Footer =====
export function Footer({ variant = 'dashboard' }) {
  const year = new Date().getFullYear();

  if (variant === 'dashboard') {
    return (
      <footer className="mt-8 py-5 px-4 md:px-6 border-t border-[var(--border-color)] text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-[var(--text-tertiary)]">
          © {year} MediCare HMS. All rights reserved.
        </p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1 sm:mt-0">
          Built with React, Node.js, Express &amp; MongoDB
        </p>
      </footer>
    );
  }

  return (
    <footer className="bg-[var(--bg-sidebar)] text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">MediCare HMS</span>
          </div>
          <p className="text-sm leading-relaxed">
            A complete hospital management platform for doctors, patients, reception, and admin teams.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Portals</h4>
          <ul className="space-y-2 text-sm">
            <li>Admin Panel</li>
            <li>Doctor Portal</li>
            <li>Reception Desk</li>
            <li>Patient Portal</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Features</h4>
          <ul className="space-y-2 text-sm">
            <li>Appointments &amp; Scheduling</li>
            <li>Billing &amp; Invoicing</li>
            <li>Lab Reports</li>
            <li>Health Assistant</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>support@medicare-hms.com</li>
            <li>+91 98765 43210</li>
            <li>24/7 Support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-6 text-center text-xs">
        © {year} MediCare HMS. Built with React, Node.js, Express &amp; MongoDB.
      </div>
    </footer>
  );
}

// ===== Dashboard Layout =====
export function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={`flex flex-col min-h-screen transition-[margin] duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          }`}
      >
        <Navbar onMenuToggle={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
        <Footer variant="dashboard" />
      </div>
    </div>
  );
}
