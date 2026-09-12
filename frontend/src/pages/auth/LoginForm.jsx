import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Toast } from '../../components/ui';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onSuccess, onRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Check portal selection
    if (!selectedRole) {
      setError('Please select a portal first.');
      return;
    }

    setLoading(true);

    try {
      // Login using MongoDB backend
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Check whether selected portal matches
      // the role stored in MongoDB
      if (result.user.role !== selectedRole) {
        setError(
          `This account is registered as ${result.user.role}. Please select the correct portal.`
        );
        return;
      }

      // Login successful
      setToast({
        message: `Welcome back, ${result.user.name}!`,
        type: 'success',
      });

      // Dashboard routes
      const roleRoutes = {
        admin: '/admin',
        doctor: '/doctor',
        receptionist: '/reception',
        patient: '/patient',
      };

      // Navigate to correct dashboard
      setTimeout(() => {
        onSuccess?.();

        navigate(
          roleRoutes[result.user.role] || '/'
        );
      }, 500);

    } catch (error) {
      console.error('Login error:', error);

      setError('Unable to connect to server.');
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
          Welcome back
        </h2>

        <p className="text-[var(--text-secondary)] text-sm mb-5">
          Sign in to access your dashboard
        </p>

        {/* Portal Selection */}
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Select Portal
        </p>

        <div className="grid grid-cols-2 gap-3">

          {/* Admin */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setError('');
            }}
            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${selectedRole === 'admin'
              ? 'border-primary-500 bg-primary-50 text-primary-600'
              : 'border-gray-200 hover:border-primary-300 text-[var(--text-primary)]'
              }`}
          >
            👨‍💼 Admin
          </button>

          {/* Doctor */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('doctor');
              setError('');
            }}
            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${selectedRole === 'doctor'
              ? 'border-primary-500 bg-primary-50 text-primary-600'
              : 'border-gray-200 hover:border-primary-300 text-[var(--text-primary)]'
              }`}
          >
            👨‍⚕️ Doctor
          </button>

          {/* Receptionist */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('receptionist');
              setError('');
            }}
            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${selectedRole === 'receptionist'
              ? 'border-primary-500 bg-primary-50 text-primary-600'
              : 'border-gray-200 hover:border-primary-300 text-[var(--text-primary)]'
              }`}
          >
            💼 Reception
          </button>

          {/* Patient */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('patient');
              setError('');
            }}
            className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${selectedRole === 'patient'
              ? 'border-primary-500 bg-primary-50 text-primary-600'
              : 'border-gray-200 hover:border-primary-300 text-[var(--text-primary)]'
              }`}
          >
            🧑 Patient
          </button>

        </div>

      </div>

      {/* Login Form */}
      <form
        id="login-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Email */}
        <Input
          id="login-email"
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
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Enter your password"
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

        {/* Error */}
        {error && (
          <div
            id="login-error"
            className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger-600 text-sm animate-fade-in"
          >
            {error}
          </div>
        )}

        {/* Sign In */}
        <Button
          id="login-submit"
          type="submit"
          className="w-full"
          size="lg"
          loading={loading}
        >
          Sign In
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="text-primary-500 font-semibold hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </p>

      </form>

      {/* Footer */}
      <p className="text-center text-xs text-[var(--text-tertiary)] mt-6">
        Built with React, Node.js, Express &amp; MongoDB
      </p>

    </div>
  );
}