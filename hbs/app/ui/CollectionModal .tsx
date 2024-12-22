import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import for autoTable
import { useRouter } from "next/navigation";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: any; // Replace 'any' with the appropriate type
  schoolCollectionsName:string;
}

export default function CollectionModal({ isOpen, onClose, collection,schoolCollectionsName }: CollectionModalProps) {
  const router = useRouter();  // Move the hook to the top level

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text

    const tableColumnHeaders = ["Item Name", "Category", "Publisher", "Quantity"];
    const tableRows = collection.items.map((item: any) => [
      item.item.name,
      item.quantity,
      item.item.category,
      item.item.publisher || "N/A",
      // item.item.price || "N/A",
    ]);
    doc.text(schoolCollectionsName, 10, 10); // Add collection name at the top
    doc.text(`${collection.name} - ${collection.grade}` , 16, 16); // Add collection name at the top
    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] }, // Black text with white fill
      startY: 20,
      theme: "grid",
    });

    doc.save(`${collection.name}- ${collection.grade}.pdf`);
  };

  const handleCheckout = async () => {
    await sessionStorage.clear();
    await router.push(`/list?collectionId=${collection.id}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl md:w-2/3 lg:w-1/2">
        <div className="flex  justify-between items-center mb-4">
          <div className="flex flex-col justify-between items-center mb-4">
             <h2 className="text-xl md:text-2xl font-bold">{schoolCollectionsName}</h2>
            <h2 className="text-xl md:text-2xl font-bold">{collection.name}-{collection.grade} </h2>
          </div>
       
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 text-white px-2 py-1 md:px-4 md:py-2 rounded"
            >
              Download PDF
            </button>
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-2 py-1 md:px-4 md:py-2 rounded"
            >
              Price List
            </button>
          </div>
        </div>
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse text-black text-xs md:text-sm">
            <thead>
              <tr>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Publisher</th>
                {/* <th className="border p-2">Approx Price</th> */}
              </tr>
            </thead>
            <tbody>
              {collection.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="border p-2">{item.item.name}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.item.category}</td>
                  <td className="border p-2">{item.item.publisher}</td>
                  {/* <td className="border p-2">{item.item.price}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
