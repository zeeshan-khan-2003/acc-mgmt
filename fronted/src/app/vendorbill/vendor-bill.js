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

export default function VendorBill() {
  const [view, setView] = useState('loading'); // 'list', 'detail', 'loading'
  const [billData, setBillData] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = searchParams.get('po_id');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login to view this page.');
      router.push('/login');
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    if (poId) {
      setView('detail');
      const fetchBillData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/vendor-bill/${poId}`, { headers });

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
      setView('list');
      const fetchPurchaseOrders = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/purchase-orders`, { headers });
          if (response.ok) {
            const data = await response.json();
            setPurchaseOrders(data);
          } else {
            console.error("Failed to fetch purchase orders");
          }
        } catch (error) {
          console.error('Error fetching purchase orders:', error);
        }
      };
      fetchPurchaseOrders();
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
        `$${p.price.toFixed(2)}`,
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
                        <CardTitle>Purchase Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PO ID</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Order Date</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseOrders.map(po => (
                                    <TableRow key={po.po_id} onClick={() => router.push(`/vendorbill?po_id=${po.po_id}`)} className="cursor-pointer">
                                        <TableCell>{po.po_id}</TableCell>
                                        <TableCell>{po.vendor_name}</TableCell>
                                        <TableCell>{new Date(po.order_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">${po.total_amount.toFixed(2)}</TableCell>
                                        <TableCell>{po.status}</TableCell>
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

  if (view === 'detail' && !billData) {
    return <div className="flex justify-center items-center h-screen">Loading vendor bill...</div>;
  }

  return (
    <>
      <Formbar />
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Vendor Bill</CardTitle>
            <div className="space-x-2">
              <Button onClick={handleGeneratePDF} variant="outline">Generate PDF</Button>
              <Button onClick={handlePayment}>Pay</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6 border-b pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Bill No</p>
                <p className="font-semibold">{billData.billNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-semibold">{billData.vendorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-semibold">{billData.reference}</p>
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
                {billData.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(product.quantity * product.price).toFixed(2)}</TableCell>
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
                        <span>${billData.totalAmount.toFixed(2)}</span>
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
