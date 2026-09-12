import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoginModal({ isOpen, onClose }) {
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setShowRegister(false);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--modal-overlay)] animate-fade-in" />

      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto card p-6 sm:p-8 border-t-4 border-t-primary-500 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Heart size={18} className="text-white" />
            </div>

            <span className="font-bold text-[var(--text-primary)]">
              MediCare HMS
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Login / Register */}
        {showRegister ? (
          <RegisterForm
            onSuccess={onClose}
            onLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={onClose}
            onRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </div>
  );
}