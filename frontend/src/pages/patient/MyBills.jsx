import { apiUrl } from "../../Api/Api";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Badge, Spinner } from "../../components/ui";
import { Receipt, Calendar, IndianRupee } from "lucide-react";

export default function PatientBills() {
  const { user } = useAuth();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientId = user?.patientId;

  useEffect(() => {
    const fetchBills = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(apiUrl("/api/bills"));

        if (!response.ok) {
          throw new Error("Failed to fetch bills");
        }

        const data = await response.json();

        const myBills = data.filter(
          (bill) =>
            String(bill.patientId) === String(patientId)
        );

        setBills(myBills);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setError("Unable to load your bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [patientId]);

  const statusVariant = {
    paid: "success",
    pending: "warning",
    overdue: "danger",
  };

  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.total || 0),
    0
  );

  const pendingAmount = bills
    .filter((bill) => bill.status === "pending")
    .reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          My Bills
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          View your hospital bills and payment status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Receipt
              size={24}
              className="text-primary-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Bills
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {bills.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <IndianRupee
              size={24}
              className="text-success-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Amount
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                â‚¹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <IndianRupee
              size={24}
              className="text-warning-500"
            />

            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Pending Amount
              </p>

              <p className="text-2xl font-bold text-[var(--text-primary)]">
                â‚¹{pendingAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card>
          <p className="text-sm text-red-500">
            {error}
          </p>
        </Card>
      )}

      {/* Bills */}
      <Card>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Billing History
        </h3>

        {bills.length === 0 ? (
          <div className="py-10 text-center">
            <Receipt
              size={40}
              className="mx-auto mb-3 text-[var(--text-tertiary)]"
            />

            <p className="text-[var(--text-secondary)]">
              No bills found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill._id || bill.id}
                className="p-4 rounded-xl border border-[var(--border-color)]"
              >
                {/* Bill Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      Hospital Bill
                    </h4>

                    <div className="flex items-center gap-1 mt-1 text-sm text-[var(--text-secondary)]">
                      <Calendar size={14} />

                      {bill.date
                        ? new Date(
                            bill.date
                          ).toLocaleDateString("en-IN")
                        : "Date unavailable"}
                    </div>
                  </div>

                  <Badge
                    variant={
                      statusVariant[bill.status] ||
                      "primary"
                    }
                  >
                    {bill.status}
                  </Badge>
                </div>

                {/* Items */}
                {bill.items?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {bill.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-[var(--text-secondary)]">
                          {item.description}
                        </span>

                        <span className="font-medium text-[var(--text-primary)]">
                          â‚¹
                          {Number(
                            item.amount || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Discount
                    </span>

                    <span className="text-[var(--text-primary)]">
                      â‚¹
                      {Number(
                        bill.discount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Total
                    </span>

                    <span className="text-lg font-bold text-[var(--text-primary)]">
                      â‚¹
                      {Number(
                        bill.total || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                {bill.paymentMethod && (
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Payment Method:{" "}
                    <span className="font-medium text-[var(--text-primary)]">
                      {bill.paymentMethod}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


