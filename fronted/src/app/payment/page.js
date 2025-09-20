"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function InvoicePayment() {
  const [paymentType, setPaymentType] = useState("receive");
  const [partnerType, setPartnerType] = useState("customer");
  const [status, setStatus] = useState("draft");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setStatus("confirmed");
    setIsConfirmed(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-2xl font-bold">Invoice Payment</h1>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="secondary">New</Button>
            <span className="text-gray-500">Pay/25/0002</span>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="default" onClick={handleConfirm} disabled={isConfirmed}>
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
                  disabled={isConfirmed}
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
                  disabled={isConfirmed}
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
                <Input value="Nimesh Pathak" disabled className="mt-2" />
                <p className="text-xs text-gray-500">(auto fill partner name from Invoice/Bill)</p>
              </div>

              {/* Amount */}
              <div>
                <Label>Amount</Label>
                <Input value="23,610" disabled className="mt-2 text-right" />
                <p className="text-xs text-gray-500">(auto fill amount due from Invoice/Bill)</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <Label>Date</Label>
                <Input type="date" className="mt-2" disabled={isConfirmed} />
              </div>

              {/* Journal */}
              <div>
                <Label>Journal</Label>
                <Select disabled={isConfirmed}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Bank / Cash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div>
                <Label>Note</Label>
                <Textarea placeholder="Alpha numeric (text)" className="mt-2" disabled={isConfirmed} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
