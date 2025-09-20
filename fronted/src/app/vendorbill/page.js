'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorBillPage() {
  const [billData, setBillData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('vendorBillData');
    if (storedData) {
      setBillData(JSON.parse(storedData));
    } else {
      alert('No vendor bill data found. Redirecting...');
      router.push('/purchase-order'); // fallback page
    }
  }, []);

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
