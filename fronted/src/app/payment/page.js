"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function InvoicePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

    // Fetch chart of accounts for Journal dropdown
    fetch(`http://127.0.0.1:5000/api/chart-of-accounts`, { headers })
      .then(res => res.json())
      .then(data => {
        // Assuming 'Bank' and 'Cash' are asset accounts
        setAccounts(data.filter(acc => acc.type === 'Asset' && (acc.account_name === 'Bank' || acc.account_name === 'Cash')));
      })
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-2xl font-bold">Invoice Payment</h1>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="secondary">New</Button>
            <span className="text-gray-500">{`Pay/25/${String(invoiceId || billId || '0000').padStart(4, '0')}`}</span>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="default" onClick={handleConfirm} disabled={isConfirmed || !journal}>
              Confirm
            </Button>
            <Button variant="outline" disabled={isConfirmed}>Print</Button>
            <Button variant="outline" disabled={isConfirmed}>Send</Button>
            <Button variant="destructive" disabled={isConfirmed}>Cancel</Button>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-4 text-sm">
            <span className={status === "draft" ? "font-semibold text-gray-700" : "text-gray-400"}>Draft</span>
            <span>→</span>
            <span className={status === "confirmed" ? "font-semibold text-green-600" : "text-gray-500"}>Confirm</span>
            <span>→</span>
            <span className="text-gray-400">Cancelled</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-4">
              {/* Payment Type */}
              <div>
                <Label>Payment Type</Label>
                <RadioGroup
                  value={paymentType}
                  onValueChange={setPaymentType}
                  className="flex gap-4 mt-2"
                  disabled
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="send" id="send" />
                    <Label htmlFor="send">Send</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="receive" id="receive" />
                    <Label htmlFor="receive">Receive</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Partner Type */}
              <div>
                <Label>Partner Type</Label>
                <RadioGroup
                  value={partnerType}
                  onValueChange={setPartnerType}
                  className="flex gap-4 mt-2"
                  disabled
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor">Vendor</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Partner Name */}
              <div>
                <Label>Partner</Label>
                <Input value={partner ? partner.name : 'Loading...'} disabled className="mt-2" />
                <p className="text-xs text-gray-500">(auto fill partner name from Invoice/Bill)</p>
              </div>

              {/* Amount */}
              <div>
                <Label>Amount</Label>
                <Input value={amount ? amount.toFixed(2) : '0.00'} disabled className="mt-2 text-right" />
                <p className="text-xs text-gray-500">(auto fill amount due from Invoice/Bill)</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <Label>Date</Label>
                <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="mt-2" disabled={isConfirmed} />
              </div>

              {/* Journal */}
              <div>
                <Label>Journal</Label>
                <Select value={journal} onValueChange={setJournal} disabled={isConfirmed}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Bank / Cash" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                        <SelectItem key={account.account_id} value={account.account_name}>
                            {account.account_name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div>
                <Label>Note</Label>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Alpha numeric (text)" className="mt-2" disabled={isConfirmed} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
