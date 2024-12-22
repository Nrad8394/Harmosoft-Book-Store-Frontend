// components/ui/ProcurementManagement.tsx
import React, { useState, useEffect } from "react";
import { getProcurements, updateProcurementStatus } from "@/handler/Api"; // Import API handler functions

interface Procurement {
  id: number;
  itemName: string;
  supplier: string;
  quantity: number;
  procurementDate: string;
  status: string;
}

export default function ProcurementManagement() {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcurements();
  }, []);

  const fetchProcurements = async () => {
    try {
      const data = await getProcurements();
      setProcurements(data);
    } catch (error) {
      console.error("Failed to fetch procurements:", error);
      setError("Unable to load procurements. Please try again later.");
    }
  };

  const handleUpdateStatus = async (procurementId: number, status: string) => {
    try {
      await updateProcurementStatus(procurementId, status);
      setProcurements(
        procurements.map((procurement) =>
          procurement.id === procurementId ? { ...procurement, status } : procurement
        )
      );
      setError(null);
    } catch (error) {
      setError("Failed to update procurement status. Please try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Procurement Management</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Procurement Management Table */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Procurement Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {procurements.length > 0 ? (
            procurements.map((procurement) => (
              <tr key={procurement.id}>
                <td className="p-2 border">{procurement.itemName}</td>
                <td className="p-2 border">{procurement.supplier}</td>
                <td className="p-2 border">{procurement.quantity}</td>
                <td className="p-2 border">{procurement.procurementDate}</td>
                <td className="p-2 border">
                  <select
                    value={procurement.status}
                    onChange={(e) =>
                      handleUpdateStatus(procurement.id, e.target.value)
                    }
                    className="border p-1 w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() =>
                      handleUpdateStatus(procurement.id, procurement.status)
                    }
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No procurements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
