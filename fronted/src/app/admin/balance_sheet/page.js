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

export default function BalanceSheet() {
  const [liabilities, setLiabilities] = useState([])
  const [assets, setAssets] = useState([])

  // Example API call
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/balance-sheet") // backend endpoint
        const data = await res.json()
        setLiabilities(data.liabilities || [])
        setAssets(data.assets || [])
      } catch (error) {
        console.error("Error fetching Balance Sheet data", error)
      }
    }
    fetchData()
  }, [])

  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + parseFloat(l.amount || 0),
    0
  )
  const totalAssets = assets.reduce(
    (sum, a) => sum + parseFloat(a.amount || 0),
    0
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Balance Sheet
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary">Print</Button>
            <Button variant="outline">Home</Button>
            <Button variant="outline">Back</Button>
            <Button variant="default">Date</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Liabilities</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Math.max(liabilities.length, assets.length) === 0 ? (
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
                  length: Math.max(liabilities.length, assets.length),
                }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{liabilities[idx]?.name || ""}</TableCell>
                    <TableCell>{liabilities[idx]?.amount || ""}</TableCell>
                    <TableCell>{assets[idx]?.name || ""}</TableCell>
                    <TableCell>{assets[idx]?.amount || ""}</TableCell>
                  </TableRow>
                ))
              )}

              {/* Totals */}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>{totalLiabilities.toFixed(2)}</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>{totalAssets.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
