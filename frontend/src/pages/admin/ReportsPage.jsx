import { Card } from '../../components/ui';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#ec4899',
  '#6366f1'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[var(--bg-secondary)] px-4 py-2.5 rounded-lg shadow-lg border border-[var(--border-color)] text-sm">
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

export default function ReportsPage() {

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReportData = async () => {

      try {

        setLoading(true);

        const [
          patientsResponse,
          appointmentsResponse,
          departmentsResponse
        ] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/appointments'),
          fetch('/api/departments')
        ]);

        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }

        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }

        if (!departmentsResponse.ok) {
          throw new Error('Failed to fetch departments');
        }

        const patientsData =
          await patientsResponse.json();

        const appointmentsData =
          await appointmentsResponse.json();

        const departmentsData =
          await departmentsResponse.json();

        setPatients(
          Array.isArray(patientsData)
            ? patientsData
            : []
        );

        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : []
        );

        setDepartments(
          Array.isArray(departmentsData)
            ? departmentsData
            : []
        );

      } catch (error) {

        console.error(
          'Error fetching report data:',
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchReportData();

  }, []);

  // Create month names
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Create monthly patient statistics
  const monthlyPatients = monthNames.map(
    (month, monthIndex) => {

      const count = patients.filter((patient) => {

        if (!patient.createdAt) {
          return false;
        }

        const date = new Date(patient.createdAt);

        return date.getMonth() === monthIndex;

      }).length;

      return {
        month,
        count
      };
    }
  );

  // Create monthly appointment statistics
  const monthlyAppointments = monthNames.map(
    (month, monthIndex) => {

      const count = appointments.filter(
        (appointment) => {

          if (!appointment.date) {
            return false;
          }

          const date = new Date(
            appointment.date
          );

          return (
            date.getMonth() === monthIndex
          );

        }
      ).length;

      return {
        month,
        count
      };
    }
  );

  /*
    Billing API does not exist yet.
    Therefore revenue is temporarily zero.
    Once /api/bills is created, we can calculate
    actual monthly revenue here.
  */
  const monthlyRevenue = monthNames.map(
    (month) => ({
      month,
      amount: 0
    })
  );

  // Department visit statistics
  const departmentVisits = departments.map(
    (department) => {

      const visits = appointments.filter(
        (appointment) =>
          appointment.department ===
          department.name
      ).length;

      return {
        name: department.name,
        visits
      };

    }
  );

  // Loading screen
  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[300px]">

        <p className="text-[var(--text-secondary)]">
          Loading reports...
        </p>

      </div>
    );
  }

  return (

    <div
      id="reports-page"
      className="space-y-6"
    >

      {/* Header */}
      <div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Analytics & Reports
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          Comprehensive hospital analytics and performance metrics
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ============================= */}
        {/* PATIENTS PER MONTH */}
        {/* ============================= */}

        <Card className="animate-fade-in-up">

          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Patients Per Month
          </h3>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={monthlyPatients}
              >

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
                  content={
                    <CustomTooltip />
                  }
                />

                <Bar
                  dataKey="count"
                  name="Patients"
                  fill="#3b82f6"
                  radius={[
                    6,
                    6,
                    0,
                    0
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* ============================= */}
        {/* APPOINTMENTS PER MONTH */}
        {/* ============================= */}

        <Card
          className="animate-fade-in-up"
          style={{
            animationDelay: '100ms'
          }}
        >

          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Appointments Per Month
          </h3>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={monthlyAppointments}
              >

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
                  content={
                    <CustomTooltip />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  name="Appointments"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: '#22c55e'
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* ============================= */}
        {/* REVENUE */}
        {/* ============================= */}

        <Card
          className="animate-fade-in-up"
          style={{
            animationDelay: '200ms'
          }}
        >

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Monthly Revenue
            </h3>

            <span className="text-xs text-[var(--text-tertiary)]">
              Billing API pending
            </span>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={monthlyRevenue}
              >

                <defs>

                  <linearGradient
                    id="revGrad"
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
                    `₹${(
                      value / 1000
                    ).toFixed(0)}K`
                  }
                />

                <Tooltip
                  content={
                    <CustomTooltip />
                  }
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#revGrad)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* ============================= */}
        {/* DEPARTMENT VISITS */}
        {/* ============================= */}

        <Card
          className="animate-fade-in-up"
          style={{
            animationDelay: '300ms'
          }}
        >

          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Most Visited Departments
          </h3>

          <div className="h-72">

            {departmentVisits.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={departmentVisits}
                    dataKey="visits"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    label={({
                      name,
                      percent
                    }) =>
                      `${name.split(' ')[0]} ${(
                        percent * 100
                      ).toFixed(0)}%`
                    }
                    fontSize={11}
                  >

                    {departmentVisits.map(
                      (_, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center">

                <p className="text-sm text-[var(--text-tertiary)]">
                  No department visit data available
                </p>

              </div>

            )}

          </div>

          {/* Department List */}

          {departmentVisits.length > 0 && (

            <div className="grid grid-cols-2 gap-2 mt-2">

              {departmentVisits.map(
                (department, index) => (

                  <div
                    key={department.name}
                    className="flex items-center gap-2 text-xs"
                  >

                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background:
                          COLORS[
                            index %
                            COLORS.length
                          ]
                      }}
                    />

                    <span className="text-[var(--text-secondary)]">
                      {department.name}
                    </span>

                    <span className="ml-auto font-medium text-[var(--text-primary)]">
                      {department.visits}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </Card>

      </div>

    </div>
  );
}