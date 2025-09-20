"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function PartnerLedger() {
  const [partners, setPartners] = useState([])
  const [selectedPartner, setSelectedPartner] = useState("")
  const [ledgerType, setLedgerType] = useState("receivable")
  const [ledgerData, setLedgerData] = useState([])

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch("http://127.0.0.1:5000/api/contacts", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPartners(data);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    if (selectedPartner && ledgerType) {
      const fetchLedgerData = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await fetch(`http://127.0.0.1:5000/api/partner-ledger?contact_id=${selectedPartner}&type=${ledgerType}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setLedgerData(data);
          } else {
            setLedgerData([]);
          }
        } catch (error) {
          console.error("Error fetching ledger data:", error);
          setLedgerData([]);
        }
      };
      fetchLedgerData();
    }
  }, [selectedPartner, ledgerType]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Partner Ledger
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="w-1/3">
                <Label>Partner</Label>
                <Select onValueChange={setSelectedPartner} value={selectedPartner}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                        {partners.map(p => (
                            <SelectItem key={p.contact_id} value={p.contact_id.toString()}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-1/3">
                <Label>Ledger Type</Label>
                <Select onValueChange={setLedgerType} value={ledgerType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select ledger type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="receivable">Receivable</SelectItem>
                        <SelectItem value="payable">Payable</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No entries found.
                  </TableCell>
                </TableRow>
              ) : (
                ledgerData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-right">{row.debit > 0 ? row.debit.toFixed(2) : ''}</TableCell>
                    <TableCell className="text-right">{row.credit > 0 ? row.credit.toFixed(2) : ''}</TableCell>
                    <TableCell className="text-right">{row.balance.toFixed(2)}</TableCell>
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