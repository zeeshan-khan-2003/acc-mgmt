"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export default function ProductMaster() {
  const [productType, setProductType] = useState("goods")

  return (<>
  
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Product Master</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label  htmlFor="name">Product Name</Label>
              <br />
              <Input  id="name" placeholder="Enter product name" />
            </div>

            <div>
              <Label>Product Type</Label>
              <br />

              <RadioGroup
                defaultValue="goods"
                onValueChange={(val) => setProductType(val)}
                className="flex gap-6 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="goods" id="goods" />
                  <Label htmlFor="goods">Goods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="service" id="service" />
                  <Label htmlFor="service">Service</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Category</Label>
              <br />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                  <SelectItem value="cat3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hsn">HSN/SAC Code</Label>
              <br />

              <Input id="hsn" placeholder="Fetch from API" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="salesPrice">Sales Price</Label>
              <br />

              <Input id="salesPrice" placeholder="22.20 Rs" type="number" />
            </div>

            <div>
              <Label htmlFor="salesTax">Sales Tax</Label>
              <br />

              <Input id="salesTax" placeholder="5%" type="text" />
            </div>

            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <br />

              <Input id="purchasePrice" placeholder="15.00 Rs" type="number" />
            </div>

            <div>
              <Label htmlFor="purchaseTax">Purchase Tax</Label>
              <br />

              <Input id="purchaseTax" placeholder="%" type="text" />
            </div>
          </div>
        </CardContent>
      </Card>
  </>

  )
}
