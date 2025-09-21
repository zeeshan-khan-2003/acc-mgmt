"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ProductMaster() {
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("goods")
  const [category, setCategory] = useState("")
  const [hsn, setHsn] = useState("")
  const [hsnQuery, setHsnQuery] = useState("")
  const [salesPrice, setSalesPrice] = useState("")
  const [salesTax, setSalesTax] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [purchaseTax, setPurchaseTax] = useState("")
  const [categories, setCategories] = useState([])
  const [hsnCodes, setHsnCodes] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  const router = useRouter()
  const debounceTimeoutRef = useRef(null)

  useEffect(() => {
    // Mock categories
    setCategories(["Wooden", "Plastic", "Metal"])
  }, [])

  // Debounce HSN code search
  useEffect(() => {
    if (!hsnQuery) {
      setHsnCodes([])
      setShowDropdown(false)
      return
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/hsn-codes?query=${encodeURIComponent(hsnQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setHsnCodes(data)
          setShowDropdown(true)
        } else {
          console.error("Backend HSN API failed")
        }
      } catch (error) {
        console.error("Error fetching HSN codes from backend:", error)
      }
    }, 300) // 300ms debounce
  }, [hsnQuery])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const productData = {
      product_name: productName,
      type: productType,
      category: category,
      hsn_code: hsn,
      sales_price: parseFloat(salesPrice),
      purchase_price: parseFloat(purchasePrice),
      purchase_tax: parseFloat(purchaseTax),
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Product created:", data)
        router.push("/admin")
      } else {
        console.error("Failed to create product")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Product Master</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-6 mt-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <Label>Product Type</Label>
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
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Label htmlFor="hsn">HSN/SAC Code</Label>
            <Input
              id="hsn"
              placeholder="Search HSN/SAC code"
              value={hsn}
              onChange={(e) => {
                setHsn(e.target.value)
                setHsnQuery(e.target.value)
              }}
              onFocus={() => {
                if (hsnCodes.length > 0) setShowDropdown(true)
              }}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 100)
              }}
            />
            {showDropdown && hsnCodes.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-y-auto shadow-md">
                {hsnCodes.map((code) => (
                  <div
                    key={code.hsn_code}
                    onClick={() => {
                      setHsn(code.hsn_code)
                      setShowDropdown(false)
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{code.hsn_code}</div>
                    <div className="text-sm text-gray-500">{code.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="salesPrice">Sales Price</Label>
            <Input
              id="salesPrice"
              placeholder="22.20 Rs"
              type="number"
              value={salesPrice}
              onChange={(e) => setSalesPrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="salesTax">Sales Tax</Label>
            <Input
              id="salesTax"
              placeholder="5%"
              type="text"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              placeholder="15.00 Rs"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="purchaseTax">Purchase Tax</Label>
            <Input
              id="purchaseTax"
              placeholder="%"
              type="text"
              value={purchaseTax}
              onChange={(e) => setPurchaseTax(e.target.value)}
            />
          </div>
        </div>
      </CardContent>

      <div className="flex justify-end p-6">
        <Button onClick={handleSubmit}>Create Product</Button>
      </div>
    </Card>
  )
}