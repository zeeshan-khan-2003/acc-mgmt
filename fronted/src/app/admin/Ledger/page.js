"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function PartnerLedger() {
  const [rows, setRows] = useState([])

  const [form, setForm] = useState({
    partner: "",
    account: "",
    reference: "",
    date: "",
    due: "",
    amount: "",
    balance: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addRow = () => {
    if (!form.partner || !form.account || !form.reference) return
    setRows([...rows, form])
    setForm({
      partner: "",
      account: "",
      reference: "",
      date: "",
      due: "",
      amount: "",
      balance: "",
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Partner Ledger
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary">Print</Button>
            <Button variant="secondary">Send</Button>
            <Button variant="outline">Home</Button>

            <Button variant="outline">Back</Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Add New Entry Form */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            <div>
              <Label>Partner</Label>
              <Input
                name="partner"
                value={form.partner}
                onChange={handleChange}
                placeholder="Partner Name"
              />
            </div>
            <div>
              <Label>Account</Label>
              <Input
                name="account"
                value={form.account}
                onChange={handleChange}
                placeholder="Account Name"
              />
            </div>
            <div>
              <Label>Reference</Label>
              <Input
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Invoice / Bill Ref No."
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Due</Label>
              <Input
                type="date"
                name="due"
                value={form.due}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addRow} className="w-full">
                Add Entry
              </Button>
            </div>
          </div>

          {/* Ledger Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Invoice / Bill Ref No.</TableHead>
                <TableHead>Invoice / Bill Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No entries added yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.partner}</TableCell>
                    <TableCell>{row.account}</TableCell>
                    <TableCell>{row.reference}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.due}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
