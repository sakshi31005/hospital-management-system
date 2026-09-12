import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  Badge,
  Button,
  Toast
} from '../../components/ui';
import {
  Calendar,
  Clock,
  User,
  Building2,
  XCircle
} from 'lucide-react';

export default function PatientAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const patientId = user?.patientId;

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/appointments');

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();

      // Show only logged-in patient's appointments
      const myAppointments = data.filter(
        (appointment) =>
          appointment.patientId === patientId
      );

      setAppointments(myAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);

      setToast({
        message: 'Failed to load appointments',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'cancelled'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to cancel appointment'
        );
      }

      await fetchAppointments();

      setToast({
        message: 'Appointment cancelled successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Cancel appointment error:', error);

      setToast({
        message: error.message,
        type: 'danger'
      });
    }
  };

  const statusVariant = {
    confirmed: 'primary',
    completed: 'success',
    waiting: 'warning',
    cancelled: 'danger',
    pending: 'warning'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-secondary)]">
          Loading your appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          My Appointments
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          View and manage your appointments
        </p>
      </div>

      {/* Appointment Count */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card padding="p-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Total
          </p>

          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {appointments.length}
          </p>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Confirmed
          </p>

          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {
              appointments.filter(
                (apt) => apt.status === 'confirmed'
              ).length
            }
          </p>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Completed
          </p>

          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {
              appointments.filter(
                (apt) => apt.status === 'completed'
              ).length
            }
          </p>
        </Card>

        <Card padding="p-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Cancelled
          </p>

          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {
              appointments.filter(
                (apt) => apt.status === 'cancelled'
              ).length
            }
          </p>
        </Card>

      </div>

      {/* Appointments */}
      <Card>

        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Appointment History
        </h2>

        {appointments.length === 0 ? (
          <div className="text-center py-12">

            <Calendar
              size={48}
              className="mx-auto text-[var(--text-tertiary)] mb-4"
            />

            <h3 className="text-lg font-medium text-[var(--text-primary)]">
              No appointments found
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mt-1">
              You don't have any appointments yet.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {appointments.map((appointment) => (

              <div
                key={appointment._id || appointment.id}
                className="p-4 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                  {/* Date */}
                  <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex flex-col items-center justify-center shrink-0">

                    <span className="text-xl font-bold text-primary-500">
                      {new Date(
                        appointment.date
                      ).getDate()}
                    </span>

                    <span className="text-xs text-primary-500">
                      {new Date(
                        appointment.date
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          month: 'short'
                        }
                      )}
                    </span>

                  </div>

                  {/* Information */}
                  <div className="flex-1 space-y-2">

                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {appointment.doctorName}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)]">
                        {appointment.department}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">

                      <span className="flex items-center gap-1">
                        <Clock size={15} />
                        {appointment.time}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={15} />
                        {new Date(
                          appointment.date
                        ).toLocaleDateString(
                          'en-IN'
                        )}
                      </span>

                      {appointment.reason && (
                        <span>
                          Reason: {appointment.reason}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Status + Action */}
                  <div className="flex flex-col items-start lg:items-end gap-3">

                    <Badge
                      variant={
                        statusVariant[
                          appointment.status
                        ] || 'primary'
                      }
                      size="sm"
                    >
                      {appointment.status}
                    </Badge>

                    {appointment.status !== 'cancelled' &&
                      appointment.status !== 'completed' && (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          onClick={() =>
                            handleCancel(
                              appointment._id ||
                              appointment.id
                            )
                          }
                        >
                          Cancel
                        </Button>
                      )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </Card>

    </div>
  );
}