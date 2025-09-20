"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Formbar from "@/components/formsbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InvoicePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState('loading'); // 'single', 'list', 'loading'
  const [allPayments, setAllPayments] = useState([]);

  // State for single payment view
  const [paymentType, setPaymentType] = useState("receive");
  const [partnerType, setPartnerType] = useState("customer");
  const [partner, setPartner] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [journal, setJournal] = useState("");
  const [note, setNote] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState("draft");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [billId, setBillId] = useState(null);

  useEffect(() => {
    const invId = searchParams.get('invoice_id');
    const bId = searchParams.get('bill_id');
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      router.push('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    if (invId || bId) {
      setView('single');
      fetch(`http://127.0.0.1:5000/api/chart-of-accounts`, { headers })
        .then(res => res.json())
        .then(data => setAccounts(data))
        .catch(err => console.error("Failed to fetch accounts:", err));

      if (invId) {
        setInvoiceId(invId);
        setPaymentType('receive');
        setPartnerType('customer');
        fetch(`http://127.0.0.1:5000/api/customer-invoices/${invId}`, { headers })
          .then(res => res.json())
          .then(invoice => {
            if (invoice) {
              setAmount(invoice.total_amount);
              fetch(`http://127.0.0.1:5000/api/contacts`, { headers })
                .then(res => res.json())
                .then(contacts => {
                  const customer = contacts.find(c => c.contact_id === invoice.customer_id);
                  setPartner(customer);
                });
            }
          })
          .catch(err => console.error("Failed to fetch invoice:", err));

        fetch(`http://127.0.0.1:5000/api/payments?invoice_id=${invId}`, { headers })
          .then(res => res.json())
          .then(payments => {
            if (payments.length > 0) {
              setIsConfirmed(true);
              setStatus("confirmed");
            }
          });
      } else if (bId) {
        setBillId(bId);
        setPaymentType('send');
        setPartnerType('vendor');
        fetch(`http://127.0.0.1:5000/api/vendor-bills/${bId}`, { headers })
          .then(res => res.json())
          .then(bill => {
            if (bill) {
              setAmount(bill.total_amount);
              fetch(`http://127.0.0.1:5000/api/contacts`, { headers })
                .then(res => res.json())
                .then(contacts => {
                  const vendor = contacts.find(c => c.contact_id === bill.vendor_id);
                  setPartner(vendor);
                });
            }
          })
          .catch(err => console.error("Failed to fetch bill:", err));

        fetch(`http://127.0.0.1:5000/api/payments?bill_id=${bId}`, { headers })
          .then(res => res.json())
          .then(payments => {
            if (payments.length > 0) {
              setIsConfirmed(true);
              setStatus("confirmed");
            }
          });
      }
    } else {
      setView('list');
      fetch('http://127.0.0.1:5000/api/payments', { headers })
        .then(res => res.json())
        .then(data => setAllPayments(data))
        .catch(err => console.error("Failed to fetch payments:", err));
    }
  }, [searchParams, router]);

  const handleConfirm = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const selectedAccount = accounts.find(acc => acc.account_name === journal);

    const paymentData = {
      invoice_id: invoiceId,
      bill_id: billId,
      payment_date: paymentDate,
      amount: amount,
      payment_method: journal,
      account_id: selectedAccount ? selectedAccount.account_id : null
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        setStatus("confirmed");
        setIsConfirmed(true);
        alert("Payment confirmed!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.msg || 'Failed to confirm payment.'}`);
      }
    } catch (error) {
        console.error("Payment submission error:", error);
        alert("An unexpected error occurred during payment submission.");
    }
  };

  if (view === 'loading') {
      return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (view === 'list') {
    return (
        <>
            <Formbar />
            <div className="max-w-6xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPayments.map(payment => (
                                    <TableRow key={payment.payment_id} onClick={() => router.push(payment.invoice_id ? `/payment?invoice_id=${payment.invoice_id}`: `/payment?bill_id=${payment.bill_id}`)} className="cursor-pointer">
                                        <TableCell>{payment.payment_id}</TableCell>
                                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>{payment.payment_method}</TableCell>
                                        <TableCell>
                                            {payment.invoice_id ? `Invoice #${payment.invoice_id}` : ''}
                                            {payment.bill_id ? `Bill #${payment.bill_id}` : ''}
                                        </TableCell>
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

  return (
    <>
    <Formbar />
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Invoice Payment</CardTitle>
                <span className="text-gray-500">{`Pay/25/${String(invoiceId || billId || '0000').padStart(4, '0')}`}</span>
            </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 text-sm text-center">
            <div className={`flex-1 text-gray-500 ${status === 'draft' && 'font-semibold text-gray-800'}`}>DRAFT</div>
            <div className="flex-1 text-gray-500">&rarr;</div>
            <div className={`flex-1 text-gray-500 ${status === 'confirmed' && 'font-semibold text-green-600'}`}>CONFIRMED</div>
            <div className="flex-1 text-gray-500">&rarr;</div>
            <div className="flex-1 text-gray-400">CANCELLED</div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="space-y-6">
              <div>
                <Label>Payment Type</Label>
                <RadioGroup value={paymentType} onValueChange={setPaymentType} className="flex gap-4 mt-2" disabled>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="send" id="send" /><Label htmlFor="send">Send</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="receive" id="receive" /><Label htmlFor="receive">Receive</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label>Partner Type</Label>
                <RadioGroup value={partnerType} onValueChange={setPartnerType} className="flex gap-4 mt-2" disabled>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="customer" id="customer" /><Label htmlFor="customer">Customer</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="vendor" id="vendor" /><Label htmlFor="vendor">Vendor</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label>Partner</Label>
                <Input value={partner ? partner.name : 'Loading...'} disabled className="mt-2" />
              </div>

              <div>
                <Label>Amount</Label>
                <Input value={amount ? amount.toFixed(2) : '0.00'} disabled className="mt-2 text-right font-semibold" />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <div>
                <Label>Date</Label>
                <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="mt-2" disabled={isConfirmed} />
              </div>

              <div>
                <Label>Journal</Label>
                <Select value={journal} onValueChange={setJournal} disabled={isConfirmed}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Select Bank / Cash" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                        <SelectItem key={account.account_id} value={account.account_name}>{account.account_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Note</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." className="mt-2" disabled={isConfirmed} />
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" disabled={isConfirmed}>Print</Button>
            <Button variant="outline" disabled={isConfirmed}>Send</Button>
            <Button variant="destructive" disabled={isConfirmed}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={isConfirmed || !journal}>
              {isConfirmed ? "Payment Done" : "Confirm Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}