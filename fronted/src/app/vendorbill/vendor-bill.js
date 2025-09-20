'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VendorBill() {
  const [billData, setBillData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = searchParams.get('po_id');

  useEffect(() => {
    if (poId) {
      const fetchBillData = async () => {
        try {
          const token = localStorage.getItem('access_token');
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
            router.push('/purchase-order'); // fallback page
          }
        } catch (error) {
          console.error('Error fetching vendor bill:', error);
          alert('An error occurred while fetching the vendor bill.');
          router.push('/purchase-order'); // fallback page
        }
      };

      fetchBillData();
    } else {
      alert('No purchase order ID found. Redirecting...');
      router.push('/purchase-order'); // fallback page
    }
  }, [poId, router]);

  if (!billData) {
    return <p>Loading vendor bill...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vendor Bill</h1>
      <p><strong>Bill No:</strong> {billData.billNo}</p>
      <p><strong>Vendor:</strong> {billData.vendorName}</p>
      <p><strong>Reference:</strong> {billData.reference}</p>

      <h2>Products</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {billData.products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>${product.price}</td>
              <td>${(product.quantity * product.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
