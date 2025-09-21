"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function TaxesMasterPage() {
  const [taxName, setTaxName] = useState("")
  const [taxComputation, setTaxComputation] = useState()
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  const validateValue = (val) => {
    if (!taxComputation) return

    if (taxComputation === "percent") {
      const num = parseFloat(val)
      if (isNaN(num) || num < 0 || num > 100) {
        setError("Value must be a percentage between 0 and 100")
      } else {
        setError("")
      }
    }

    if (taxComputation === "fixed") {
      const num = parseFloat(val)
      if (isNaN(num) || num < 0) {
        setError("Value must be a positive number")
      } else {
        setError("")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (error) {
      console.error("Cannot submit due to validation error")
      return
    }

    const taxData = {
      tax_name: taxName,
      computation_method: taxComputation === "percent" ? "Percentage" : "Fixed Value",
      rate: parseFloat(value),
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/taxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(taxData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Tax created:", data)
        // Handle success (e.g., show a success message, redirect)
      } else {
        console.error("Failed to create tax")
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

   return (
    <>
<Card className="shadow-md rounded-2xl w-full max-w-5xl mx-auto">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Taxes Master</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <div>
            <Label htmlFor="taxName">Tax Name</Label>
            {/* <br /> */}
            <br />
            <Input
              id="taxName"
              placeholder="5% GST S"
              value={taxName}
              onChange={(e) => setTaxName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="taxComputation">Tax Computation</Label>
            <Select onValueChange={(val) => setTaxComputation(val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="% or Fixed Value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="taxValue">Value</Label>
            <br />
            <Input
              id="taxValue"
              placeholder="say 5% or 5.00"
              value={value}
              disabled={!taxComputation}
              onChange={(e) => {
                setValue(e.target.value)
                validateValue(e.target.value)
              }}
              className="mt-1"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </CardContent>
        <div className="flex justify-end p-6">
          <Button onClick={handleSubmit}>Create Tax</Button>
        </div>
      </Card>
    </>
  )

}