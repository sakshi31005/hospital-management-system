import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Badge, DataTable, Tabs } from '../../components/ui';
import {
  Users,
  Stethoscope,
  Calendar,
  BedDouble,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const todayStr = new Date().toISOString().split('T')[0];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [chartTab, setChartTab] = useState('patients');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  // =========================
  // FETCH APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // =========================
  // FETCH DOCTORS
  // =========================
  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // =========================
  // FETCH PATIENTS
  // =========================
  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // =========================
  // REAL DATA CALCULATIONS
  // =========================

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === todayStr
  );

  const totalAppointments = appointments.length;

  // Beds and billing APIs do not exist yet
  const availableBeds = 0;
  const totalRevenue = 0;
  const pendingBills = [];

  // =========================
  // DEPARTMENT VISITS
  // Calculated from real appointments
  // =========================

  const departmentVisitMap = {};

  appointments.forEach((appointment) => {
    const department = appointment.department || 'Other';

    if (!departmentVisitMap[department]) {
      departmentVisitMap[department] = 0;
    }

    departmentVisitMap[department]++;
  });

  const departmentVisits = Object.entries(departmentVisitMap)
    .map(([name, visits]) => ({
      name,
      visits,
    }))
    .sort((a, b) => b.visits - a.visits);

  // =========================
  // STATUS COLORS
  // =========================

  const statusColor = (status) => {
    const map = {
      confirmed: 'primary',
      completed: 'success',
      waiting: 'warning',
      cancelled: 'danger',
      pending: 'warning',
    };

    return map[status] || 'default';
  };

  // =========================
  // APPOINTMENT TABLE
  // =========================

  const appointmentColumns = [
    {
      key: 'patientName',
      label: 'Patient',
      sortable: true,
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge
          variant={statusColor(val)}
          dot
        >
          {val
            ? val.charAt(0).toUpperCase() + val.slice(1)
            : 'Unknown'}
        </Badge>
      ),
    },
  ];

  // =========================
  // CHART COLORS
  // =========================

  const CHART_COLORS = [
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#14b8a6',
    '#ec4899',
    '#6366f1',
  ];

  // =========================
  // CUSTOM TOOLTIP
  // =========================

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="bg-[var(--bg-secondary)] px-4 py-2 rounded-lg shadow-lg border border-[var(--border-color)] text-sm">
        <p className="font-medium text-[var(--text-primary)]">
          {label}
        </p>

        {payload.map((item, index) => (
          <p
            key={index}
            className="text-[var(--text-secondary)]"
          >
            {item.name}:{' '}
            <span
              className="font-semibold"
              style={{ color: item.color }}
            >
              {typeof item.value === 'number' &&
              item.value > 999
                ? `₹${(item.value / 1000).toFixed(0)}K`
                : item.value}
            </span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      id="admin-dashboard-page"
      className="min-w-0 max-w-full space-y-6 overflow-hidden"
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Admin Dashboard
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="success"
            dot
            size="md"
          >
            System Online
          </Badge>

          <span className="text-sm text-[var(--text-tertiary)]">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        <StatCard
          title="Total Doctors"
          value={doctors.length}
          icon={Stethoscope}
          color="primary"
          delay={0}
        />

        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="success"
          delay={100}
        />

        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          color="warning"
          delay={200}
        />

        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon={BedDouble}
          color="teal"
          delay={300}
        />

        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          color="purple"
          delay={400}
        />

        <StatCard
          title="Pending Bills"
          value={pendingBills.length}
          icon={Activity}
          color="danger"
          delay={500}
        />

      </div>

      {/* =========================
          CHARTS
      ========================= */}

      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MAIN CHART */}

        <Card
          className="min-w-0 lg:col-span-2 animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between mb-6">

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Hospital Overview
            </h3>

            <Tabs
              tabs={[
                {
                  id: 'patients',
                  label: 'Patients',
                },
                {
                  id: 'appointments',
                  label: 'Appointments',
                },
                {
                  id: 'revenue',
                  label: 'Revenue',
                },
              ]}
              activeTab={chartTab}
              onChange={setChartTab}
            />

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              {chartTab === 'patients' ? (

                <BarChart data={[]}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="count"
                    name="Patients"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>

              ) : chartTab === 'appointments' ? (

                <LineChart data={[]}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Appointments"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{
                      fill: '#22c55e',
                      r: 5,
                    }}
                  />
                </LineChart>

              ) : (

                <AreaChart data={[]}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `₹${(value / 1000).toFixed(0)}K`
                    }
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />

                </AreaChart>

              )}

            </ResponsiveContainer>

          </div>
        </Card>

        {/* =========================
            DEPARTMENT VISITS
        ========================= */}

        <Card
          className="min-w-0 animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >

          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Department Visits
          </h3>

          <div className="h-56">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={departmentVisits.slice(0, 4)}
                  dataKey="visits"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                >

                  {departmentVisits
                    .slice(0, 4)
                    .map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          CHART_COLORS[
                            index % CHART_COLORS.length
                          ]
                        }
                      />
                    ))}

                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">

            {departmentVisits
              .slice(0, 4)
              .map((department, index) => (

                <div
                  key={department.name}
                  className="flex items-center gap-2 text-xs"
                >

                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[
                          index % CHART_COLORS.length
                        ],
                    }}
                  />

                  <span className="text-[var(--text-secondary)] truncate">
                    {department.name}
                  </span>

                </div>

              ))}

            {departmentVisits.length === 0 && (
              <p className="text-xs text-[var(--text-tertiary)] col-span-2 text-center">
                No department visits yet
              </p>
            )}

          </div>

        </Card>

      </div>

      {/* =========================
          TODAY'S APPOINTMENTS
      ========================= */}

      <Card
        className="min-w-0 animate-fade-in-up"
        style={{ animationDelay: '500ms' }}
      >

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Today's Appointments
          </h3>

          <button
            id="view-all-appointments"
            onClick={() =>
              navigate('/admin/appointments')
            }
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
          >
            View All
            <ArrowRight size={16} />
          </button>

        </div>

        <DataTable
          columns={appointmentColumns}
          data={todayAppointments}
        />

      </Card>

      {/* =========================
          BOTTOM ROW
      ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DOCTORS */}

        <Card
          className="min-w-0 animate-fade-in-up"
          style={{ animationDelay: '600ms' }}
        >

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Doctors
            </h3>

            <button
              onClick={() =>
                navigate('/admin/doctors')
              }
              className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              Manage
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="space-y-3">

            {doctors.slice(0, 5).map((doctor) => (

              <div
                key={doctor._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-semibold text-sm">
                    {doctor.name
                      ?.split(' ')
                      .map((name) => name[0])
                      .join('')
                      .substring(0, 2)}
                  </div>

                  <div>

                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {doctor.name}
                    </p>

                    <p className="text-xs text-[var(--text-secondary)]">
                      {doctor.specialization}
                    </p>

                  </div>

                </div>

                <Badge
                  variant={
                    doctor.status === 'active'
                      ? 'success'
                      : 'warning'
                  }
                  dot
                  size="xs"
                >
                  {doctor.status === 'active'
                    ? 'Active'
                    : 'On Leave'}
                </Badge>

              </div>

            ))}

            {doctors.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
                No doctors found
              </p>
            )}

          </div>

        </Card>

        {/* BED OVERVIEW */}

        <Card
          className="min-w-0 animate-fade-in-up"
          style={{ animationDelay: '700ms' }}
        >

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Bed Overview
            </h3>

            <button
              onClick={() =>
                navigate('/admin/beds')
              }
              className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              Manage
              <ArrowRight size={16} />
            </button>

          </div>

          {['General Ward', 'ICU', 'Private Room'].map(
            (ward) => {

              const wardBeds = [];
              const occupied = 0;
              const total = 0;
              const percentage = 0;

              return (
                <div
                  key={ward}
                  className="mb-4"
                >

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {ward}
                    </span>

                    <span className="text-xs text-[var(--text-secondary)]">
                      {occupied}/{total} occupied
                    </span>

                  </div>

                  <div className="h-2.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">

                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out bg-accent-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            }
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">

            {[
              {
                label: 'Occupied',
                count: 0,
                color: 'bg-danger-500',
              },
              {
                label: 'Available',
                count: 0,
                color: 'bg-accent-500',
              },
              {
                label: 'Maintenance',
                count: 0,
                color: 'bg-warning-500',
              },
            ].map((item) => (

              <div
                key={item.label}
                className="text-center p-3 rounded-xl bg-[var(--bg-tertiary)]"
              >

                <div className="flex items-center justify-center gap-1.5 mb-1">

                  <span
                    className={`w-2 h-2 rounded-full ${item.color}`}
                  />

                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    {item.count}
                  </span>

                </div>

                <span className="text-xs text-[var(--text-secondary)]">
                  {item.label}
                </span>

              </div>

            ))}

          </div>

        </Card>

      </div>

    </div>
  );
}