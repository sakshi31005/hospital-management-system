import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Badge,
  DataTable,
  SearchInput,
  Tabs,
  Toast
} from '../../components/ui';
import { apiUrl } from "../../Api/Api";
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function BillingManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Real bills from MongoDB
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bills
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(apiUrl("/api/bills"));

      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }

      const data = await response.json();

      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  // Tabs
  const tabs = [
    {
      id: 'all',
      label: 'All',
      count: bills.length
    },
    {
      id: 'paid',
      label: 'Paid',
      count: bills.filter((b) => b.status === 'paid').length
    },
    {
      id: 'pending',
      label: 'Pending',
      count: bills.filter((b) => b.status === 'pending').length
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: bills.filter((b) => b.status === 'overdue').length
    }
  ];

  // Filter bills
  const filtered = bills.filter((bill) => {
    const patientName = bill.patientName || '';

    const matchSearch = patientName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchTab =
      activeTab === 'all' || bill.status === activeTab;

    return matchSearch && matchTab;
  });

  // Status colors
  const statusColor = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger'
  };

  // Generate PDF
  const generatePDF = (bill) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('MediCare HMS', 20, 20);

    doc.setFontSize(12);
    doc.text('Hospital Bill', 20, 30);

    doc.setFontSize(10);

    doc.text(
      `Bill ID: ${bill._id}`,
      20,
      45
    );

    doc.text(
      `Patient: ${bill.patientName}`,
      20,
      52
    );

    doc.text(
      `Date: ${new Date(bill.date).toLocaleDateString('en-IN')}`,
      20,
      59
    );

    doc.text(
      `Status: ${(bill.status || '').toUpperCase()}`,
      20,
      66
    );

    doc.line(20, 72, 190, 72);

    let y = 82;

    doc.text('Description', 20, y);
    doc.text('Amount (₹)', 150, y);

    y += 8;

    (bill.items || []).forEach((item) => {
      doc.text(item.description || '', 20, y);

      doc.text(
        `₹${Number(item.amount || 0).toLocaleString('en-IN')}`,
        150,
        y
      );

      y += 7;
    });

    doc.line(20, y, 190, y);

    y += 8;

    if (Number(bill.discount || 0) > 0) {
      doc.text(
        `Discount: -₹${Number(bill.discount).toLocaleString('en-IN')}`,
        120,
        y
      );

      y += 7;
    }

    doc.setFontSize(12);

    doc.text(
      `Total: ₹${Number(bill.total || 0).toLocaleString('en-IN')}`,
      120,
      y + 3
    );

    doc.save(`bill_${bill._id}.pdf`);

    setToast({
      message: 'PDF downloaded',
      type: 'success'
    });
  };

  // Totals
  const totalRevenue = bills
    .filter((bill) => bill.status === 'paid')
    .reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0
    );

  const totalPending = bills
    .filter((bill) => bill.status === 'pending')
    .reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0
    );

  const totalOverdue = bills
    .filter((bill) => bill.status === 'overdue')
    .reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0
    );

  // Table columns
  const columns = [
    {
      key: '_id',
      label: 'Bill ID',
      render: (val) => (
        <span className="font-mono text-xs">
          {val ? val.slice(-8) : 'â€”'}
        </span>
      )
    },

    {
      key: 'patientName',
      label: 'Patient',
      sortable: true
    },

    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : 'â€”'
    },

    {
      key: 'total',
      label: 'Amount',
      sortable: true,
      render: (val) => (
        <span className="font-semibold">
          ₹{Number(val || 0).toLocaleString('en-IN')}
        </span>
      )
    },

    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge
          variant={statusColor[val] || 'warning'}
          dot
        >
          {val
            ? val.charAt(0).toUpperCase() + val.slice(1)
            : 'Pending'}
        </Badge>
      )
    },

    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (val) =>
        val || (
          <span className="text-[var(--text-tertiary)]">
            -
          </span>
        )
    },

    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={Download}
          onClick={(e) => {
            e.stopPropagation();
            generatePDF(row);
          }}
        >
          PDF
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Billing Management
        </h1>

        <p className="text-[var(--text-secondary)]">
          Manage hospital bills and payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--text-secondary)]">
              Total Revenue
            </p>

            <p className="text-2xl font-bold mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--text-secondary)]">
              Pending
            </p>

            <p className="text-2xl font-bold mt-1">
              ₹{totalPending.toLocaleString('en-IN')}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--text-secondary)]">
              Overdue
            </p>

            <p className="text-2xl font-bold mt-1">
              ₹{totalOverdue.toLocaleString('en-IN')}
            </p>
          </div>
        </Card>

      </div>

      {/* Search + Tabs */}
      <Card>

        <div className="p-5 space-y-5">

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by patient name..."
          />

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

        </div>

      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <div className="p-8 text-center">
            Loading bills...
          </div>
        </Card>
      )}

      {/* Error */}
      {!loading && error && (
        <Card>
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && (
        <Card>

          <DataTable
            columns={columns}
            data={filtered}
          />

          {filtered.length === 0 && (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              No bills found.
            </div>
          )}

        </Card>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
