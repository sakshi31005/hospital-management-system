import { useState, useEffect, useRef } from 'react';

// ===== Button =====
export function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, disabled = false, loading = false, className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:scale-[0.98]',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    success: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
    </button>
  );
}

// ===== Badge =====
export function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }) {
  const variants = {
    default: 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-200',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
    success: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
    danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-accent-500' : variant === 'danger' ? 'bg-danger-500' : variant === 'warning' ? 'bg-warning-500' : 'bg-surface-400'}`} />}
      {children}
    </span>
  );
}

// ===== Card =====
export function Card({ children, className = '', hover = false, padding = 'p-6', ...props }) {
  return (
    <div className={`card ${padding} ${hover ? 'card-interactive' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

// ===== StatCard =====
export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = numValue / (duration / 16);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += increment;
        if (start >= numValue) {
          setDisplayValue(numValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [numValue, delay]);

  const colorMap = {
    primary: { bg: 'bg-primary-500/10', text: 'text-primary-500', icon: 'text-primary-500' },
    success: { bg: 'bg-accent-500/10', text: 'text-accent-500', icon: 'text-accent-500' },
    warning: { bg: 'bg-warning-500/10', text: 'text-warning-500', icon: 'text-warning-500' },
    danger: { bg: 'bg-danger-500/10', text: 'text-danger-500', icon: 'text-danger-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: 'text-purple-500' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', icon: 'text-teal-500' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <Card hover className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] animate-count-up">
            {typeof value === 'string' && value.startsWith('₹') ? `₹${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-accent-500' : 'text-danger-500'}`}>
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
              <span className="text-[var(--text-tertiary)]">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          {Icon && <Icon size={24} className={c.icon} />}
        </div>
      </div>
    </Card>
  );
}

// ===== Input =====
export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-lg border bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${Icon ? 'pl-10' : ''
            } ${error ? 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500' : 'border-[var(--input-border)]'}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

// ===== Select =====
export function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <select
        className="w-full px-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

// ===== Textarea =====
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-sm font-medium text-[var(--text-primary)]">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none ${error ? 'border-danger-500' : 'border-[var(--input-border)]'
          }`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

// ===== Modal =====
export function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--modal-overlay)] animate-fade-in" />
      <div
        className={`relative w-full ${sizeClasses[size]} bg-[var(--bg-secondary)] rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-color)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Avatar =====
export function Avatar({ name, src, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';

  const colors = ['bg-primary-500', 'bg-accent-500', 'bg-warning-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500'];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover ${className}`} />;
  }

  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
      {initials}
    </div>
  );
}

// ===== Spinner =====
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizeClasses[size]} border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  );
}

// ===== EmptyState =====
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="p-4 rounded-2xl bg-surface-100 dark:bg-surface-800 mb-4">
          <Icon size={48} className="text-[var(--text-tertiary)]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

// ===== Toast =====
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClasses = {
    success: 'bg-accent-500 text-white',
    error: 'bg-danger-500 text-white',
    warning: 'bg-warning-500 text-white',
    info: 'bg-primary-500 text-white',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in-right ${typeClasses[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-80 cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

// ===== SearchInput =====
export function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
      />
    </div>
  );
}

// ===== DataTable =====
export function DataTable({ columns, data, onRowClick, emptyMessage = 'No data found', className = '' }) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedData = sortField
    ? [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    })
    : data;

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] ${col.sortable ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''}`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortField === col.key && (
                    <span className="text-primary-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[var(--border-light)] transition-colors hover:bg-[var(--bg-tertiary)] ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 text-[var(--text-primary)]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== Tabs =====
export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 p-1 bg-[var(--bg-tertiary)] rounded-xl overflow-x-auto ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-surface-200 text-surface-600'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ===== Pagination =====
export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-2 text-[var(--text-tertiary)]">...</span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 text-sm rounded-lg transition-colors cursor-pointer ${p === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
