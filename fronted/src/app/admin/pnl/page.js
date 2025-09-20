"use client"

import { useEffect, useState } from "react"
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

export default function ProfitLossReport() {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await res.json()
        setExpenses(data.expenses || [])
        setIncome(data.income || [])
      } catch (error) {
        console.error("Error fetching P&L data", error)
      }
    }
    fetchData()
  }, [])

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  )
  const totalIncome = income.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  )
  const netProfit = totalIncome - totalExpenses

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Profit &amp; Loss Report
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary">Print</Button>
            <Button variant="outline">Home</Button>
            <Button variant="outline">Back</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expenses</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Math.max(expenses.length, income.length) === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                Array.from({
                  length: Math.max(expenses.length, income.length),
                }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{expenses[idx]?.name || ""}</TableCell>
                    <TableCell>{expenses[idx]?.amount || ""}</TableCell>
                    <TableCell>{income[idx]?.name || ""}</TableCell>
                    <TableCell>{income[idx]?.amount || ""}</TableCell>
                  </TableRow>
                ))
              )}

              {/* Net Profit Row */}
              <TableRow
                className={`font-semibold ${
                  netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <TableCell>Net Profit</TableCell>
                <TableCell colSpan={3}>{netProfit.toFixed(2)}</TableCell>
              </TableRow>

              {/* Totals */}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>{totalExpenses.toFixed(2)}</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>{totalIncome.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
