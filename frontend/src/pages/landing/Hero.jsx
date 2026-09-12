import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Footer } from '../../components/layout';
import LoginModal from '../auth/LoginModal';
import {
  Heart, Sun, Moon, Stethoscope, Users, Calendar, Building2,
  ClipboardList, FlaskConical, Bot, Receipt, ShieldCheck, ArrowRight, Menu, X
} from 'lucide-react';

const PORTALS = [
  {
    role: 'Admin',
    icon: ShieldCheck,
    gradient: 'from-primary-500 to-primary-700',
    desc: 'Manage doctors, departments, beds, billing and hospital-wide analytics from one control panel.',
  },
  {
    role: 'Doctor',
    icon: Stethoscope,
    gradient: 'from-teal-500 to-teal-700',
    desc: 'View your daily schedule, patient history, and create prescriptions in a few clicks.',
  },
  {
    role: 'Receptionist',
    icon: Users,
    gradient: 'from-purple-500 to-purple-700',
    desc: 'Register patients, book appointments, and generate bills at the front desk.',
  },
  {
    role: 'Patient',
    icon: Heart,
    gradient: 'from-rose-500 to-rose-700',
    desc: 'Book appointments, track prescriptions, view lab reports, and chat with the health assistant.',
  },
];

const FEATURES = [
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Book and manage appointments across every department with live slot availability.' },
  { icon: ClipboardList, title: 'Digital Prescriptions', desc: 'Doctors create prescriptions patients can view and download as PDF instantly.' },
  { icon: FlaskConical, title: 'Lab Reports', desc: 'Track lab tests from request to result, with normal-range flags built in.' },
  { icon: Receipt, title: 'Billing & Invoicing', desc: 'Generate and track bills, payments, and outstanding balances with ease.' },
  { icon: Building2, title: 'Bed Management', desc: 'Live view of ward occupancy across General, ICU, and Private rooms.' },
  { icon: Bot, title: 'Health Assistant', desc: 'A built-in symptom checker that points patients to the right department.' },
];

const STATS = [
  { value: '45+', label: 'Doctors' },
  { value: '820+', label: 'Patients' },
  { value: '8', label: 'Departments' },
  { value: '24/7', label: 'Service' },
];

export default function Hero({ autoOpenLogin = false }) {
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showLogin, setShowLogin] = useState(autoOpenLogin);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (autoOpenLogin) setShowLogin(true);
  }, [autoOpenLogin]);

  // Already logged in? Go straight to the right dashboard.
  if (isAuthenticated && user) {
    const roleRoutes = { admin: '/admin', doctor: '/doctor', receptionist: '/reception', patient: '/patient' };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* Top Nav */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-lg">MediCare HMS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#portals" className="hover:text-[var(--text-primary)] transition-colors">Portals</a>
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} className="text-warning-400" /> : <Moon size={20} />}
            </button>
            <button
              id="hero-signin-btn"
              onClick={() => setShowLogin(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] cursor-pointer"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] px-4 py-4 space-y-3 bg-[var(--bg-secondary)]">
            <a href="#portals" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[var(--text-secondary)]">Portals</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[var(--text-secondary)]">Features</a>
            <button
              onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
              className="w-full px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center animate-float">
            <Heart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight bg-gradient-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent">
            Hospital management,<br className="hidden sm:block" /> made effortless
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10">
            One platform for doctors, patients, reception, and admin teams — appointments, prescriptions, billing, lab reports, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary-700 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign In to your Portal <ArrowRight size={18} />
            </button>
            <a
              href="#portals"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur text-white font-semibold transition-all cursor-pointer"
            >
              Explore Portals
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 hover:-translate-y-1 hover:bg-white/15 transition-all">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">A dedicated portal for every role</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Sign in and you'll land straight on the dashboard built for your role.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PORTALS.map((p, i) => (
            <button
              key={p.role}
              onClick={() => setShowLogin(true)}
              className="text-left card p-6 card-interactive cursor-pointer animate-fade-in-up group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <p.icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{p.role} Portal</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{p.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 group-hover:gap-2 transition-all">
                Sign in <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[var(--bg-secondary)] border-y border-[var(--border-color)] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Everything a hospital needs</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Built to cover the day-to-day operations across every department.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-primary-500" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">Ready to get started?</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">Sign in with your account, or try one of the demo logins to explore any portal instantly.</p>
        <button
          onClick={() => setShowLogin(true)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          Sign In <ArrowRight size={18} />
        </button>
      </section>

      <Footer variant="landing" />
    </div>
  );
}
