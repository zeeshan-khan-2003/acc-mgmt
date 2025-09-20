'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Formbar from '@/components/formsbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalesInvoice() {
  const [view, setView] = useState('loading'); // 'list', 'detail', 'loading'
  const [invoiceData, setInvoiceData] = useState(null);
  const [salesOrders, setSalesOrders] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const soId = searchParams.get('so_id');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login to view this page.');
      router.push('/login');
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    if (soId) {
      setView('detail');
      const fetchInvoiceData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/sales-orders/${soId}`, { headers });

          if (response.ok) {
            const data = await response.json();
            setInvoiceData(data);
          } else {
            const errorData = await response.json();
            alert(`Error fetching sales order: ${errorData.msg}`);
            router.push('/sales-order');
          }
        } catch (error) {
          console.error('Error fetching sales order:', error);
          alert('An error occurred while fetching the sales order.');
          router.push('/sales-order');
        }
      };
      fetchInvoiceData();
    } else {
      setView('list');
      const fetchSalesOrders = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/sales-orders`, { headers });
          if (response.ok) {
            const data = await response.json();
            setSalesOrders(data);
          } else {
            console.error("Failed to fetch sales orders");
          }
        } catch (error) {
          console.error('Error fetching sales orders:', error);
        }
      };
      fetchSalesOrders();
    }
  }, [soId, router]);

  const handleGeneratePDF = () => {
    if (!invoiceData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Sales Invoice', 14, 22);

    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceData.so_id}`, 14, 32);
    doc.text(`Customer: ${invoiceData.customer_name}`, 14, 40);
    doc.text(`Reference: ${invoiceData.ref_no}`, 14, 48);

    autoTable(doc, {
      startY: 60,
      head: [['#', 'Product Name', 'Qty', 'Price', 'Total']],
      body: invoiceData.items.map((p, i) => [
        i + 1,
        p.product_name,
        p.quantity,
        `$${p.unit_price.toFixed(2)}`,
        `$${(p.quantity * p.unit_price).toFixed(2)}`
      ])
    });

    doc.save(`sales-invoice-${invoiceData.so_id}.pdf`);
  };

  const handleCreateInvoiceAndPay = async () => {
    if (!invoiceData) return;

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Please login to proceed.');
        router.push('/login');
        return;
      }

      const invoicePayload = {
        so_id: soId,
        customer_id: invoiceData.customer_id,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Due in 30 days
        total_amount: invoiceData.total_amount,
        status: 'Unpaid'
      };

      const response = await fetch(`http://127.0.0.1:5000/api/customer-invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoicePayload)
      });

      if (response.ok) {
        const newInvoice = await response.json();
        router.push(`/payment?invoice_id=${newInvoice.invoice_id}`);
      } else {
        const errorData = await response.json();
        alert(`Error creating customer invoice: ${errorData.msg}`);
      }
    } catch (error) {
      console.error('Error creating customer invoice:', error);
      alert('An error occurred while creating the customer invoice.');
    }
  };

  if (view === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (view === 'list') {
      return (
          <>
            <Formbar />
            <div className="max-w-6xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SO ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Order Date</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesOrders.map(so => (
                                    <TableRow key={so.so_id} onClick={() => router.push(`/sales-invoice?so_id=${so.so_id}`)} className="cursor-pointer">
                                        <TableCell>{so.so_id}</TableCell>
                                        <TableCell>{so.customer_name}</TableCell>
                                        <TableCell>{new Date(so.order_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">${so.total_amount.toFixed(2)}</TableCell>
                                        <TableCell>{so.status_ ? 'Confirmed' : 'Draft'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
          </>
      )
  }

  if (view === 'detail' && !invoiceData) {
    return <div className="flex justify-center items-center h-screen">Loading sales invoice...</div>;
  }

  return (
    <>
      <Formbar />
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Sales Invoice</CardTitle>
            <div className="space-x-2">
              <Button onClick={handleGeneratePDF} variant="outline">Generate PDF</Button>
              <Button onClick={handleCreateInvoiceAndPay}>Receive Payment</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6 border-b pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice No</p>
                <p className="font-semibold">{invoiceData.so_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold">{invoiceData.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-semibold">{invoiceData.ref_no}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={item.so_item_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-6">
              <div className="w-full max-w-xs">
                  <Card className="p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Grand Total:</span>
                        <span>${invoiceData.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
