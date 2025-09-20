'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'; // shadcn button
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function VendorBill() {
  const [billData, setBillData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = searchParams.get('po_id');

  useEffect(() => {
    if (poId) {
      const fetchBillData = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            alert('Please login to view this page.');
            router.push('/login');
            return;
          }

          const response = await fetch(`http://localhost:5000/api/vendor-bill/${poId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setBillData(data);
          } else {
            const errorData = await response.json();
            alert(`Error fetching vendor bill: ${errorData.msg}`);
            router.push('/purchase-order');
          }
        } catch (error) {
          console.error('Error fetching vendor bill:', error);
          alert('An error occurred while fetching the vendor bill.');
          router.push('/purchase-order');
        }
      };

      fetchBillData();
    } else {
      alert('No purchase order ID found. Redirecting...');
      router.push('/purchase-order');
    }
  }, [poId, router]);

  const handleGeneratePDF = () => {
    if (!billData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Vendor Bill', 14, 22);

    doc.setFontSize(12);
    doc.text(`Bill No: ${billData.billNo}`, 14, 32);
    doc.text(`Vendor: ${billData.vendorName}`, 14, 40);
    doc.text(`Reference: ${billData.reference}`, 14, 48);

    autoTable(doc, {
      startY: 60,
      head: [['#', 'Product Name', 'Qty', 'Price', 'Total']],
      body: billData.products.map((p, i) => [
        i + 1,
        p.name,
        p.quantity,
        `$${p.price}`,
        `$${(p.quantity * p.price).toFixed(2)}`
      ])
    });

    doc.save(`vendor-bill-${billData.billNo}.pdf`);
  };

  const handlePayment = async () => {
    if (!billData) return;

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Please login to proceed with payment.');
        router.push('/login');
        return;
      }

      // First, create a vendor bill
      const billPayload = {
        po_id: poId,
        vendor_id: billData.vendorId,
        bill_date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Due in 30 days
        total_amount: billData.totalAmount,
        status: 'Unpaid'
      };

      const response = await fetch(`http://127.0.0.1:5000/api/vendor-bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billPayload)
      });

      if (response.ok) {
        const newBill = await response.json();
        // Now redirect to payment page with the new bill_id
        router.push(`/payment?bill_id=${newBill.bill_ref_id}`);
      } else {
        const errorData = await response.json();
        alert(`Error creating vendor bill: ${errorData.msg}`);
      }
    } catch (error) {
      console.error('Error creating vendor bill:', error);
      alert('An error occurred while creating the vendor bill.');
    }
  };

  if (!billData) {
    return <p>Loading vendor bill...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Bill</h1>
        <div className="space-x-4">
          <Button onClick={handleGeneratePDF} variant="outline">Generate PDF</Button>
          <Button onClick={handlePayment}>Pay</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Bill No:</strong> {billData.billNo}</p>
        <p><strong>Vendor:</strong> {billData.vendorName}</p>
        <p><strong>Reference:</strong> {billData.reference}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Products</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {billData.products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">${(product.quantity * product.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
