"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TaxesMasterPage() {
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Taxes Master</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary">New</Button>
            <Button variant="default">Confirm</Button>
            <Button variant="destructive">Archived</Button>
            <Button variant="outline">Home</Button>
            <Button variant="outline">Back</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <div>
            <Label htmlFor="taxName">Tax Name</Label>
            <Input id="taxName" placeholder="5% GST S" />
          </div>

          <div>
            <Label htmlFor="taxComputation">Tax Computation</Label>
            <Select onValueChange={(val) => setTaxComputation(val)}>
              <SelectTrigger>
                <SelectValue placeholder="% or Fixed Value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="taxFor">Tax For</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select ( Purchase / Sales )" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="taxValue">Value</Label>
            <Input
              id="taxValue"
              placeholder="say 5% or 5.00"
              value={value}
              disabled={!taxComputation}
              onChange={(e) => {
                setValue(e.target.value)
                validateValue(e.target.value)
              }}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
