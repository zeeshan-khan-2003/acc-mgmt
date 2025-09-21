"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PlusIcon from "@/components/plusicon"

export default function TaxList() {
  const router = useRouter()
  const [taxes, setTaxes] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchTaxes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/taxes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setTaxes(data)
        } else {
          console.error("Failed to fetch taxes")
        }
      } catch (error) {
        console.error("Error fetching taxes:", error)
      }
    }

    fetchTaxes()
  }, [router])

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Taxes</h2>
        <Button onClick={() => router.push("/admin/forms/taxes/create")}>
          Create Tax
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tax Name</TableHead>
            <TableHead>Computation Method</TableHead>
            <TableHead>Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxes.map((tax) => (
            <TableRow key={tax.tax_id}>
              <TableCell>{tax.tax_name}</TableCell>
              <TableCell>{tax.computation_method}</TableCell>
              <TableCell>{tax.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}