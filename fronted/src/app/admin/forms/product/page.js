"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function ProductMaster() {
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("goods")
  const [category, setCategory] = useState("")
  const [hsn, setHsn] = useState("")
  const [salesPrice, setSalesPrice] = useState("")
  const [salesTax, setSalesTax] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [purchaseTax, setPurchaseTax] = useState("")
  const [categories, setCategories] = useState([])
  const [hsnCodes, setHsnCodes] = useState([])

  useEffect(() => {
    // Fetch categories from backend
    // For now, using mock data
    setCategories(["Wooden", "Plastic", "Metal"]);

    // Fetch HSN codes from backend
    const fetchHsnCodes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/hsn-codes");
        if (response.ok) {
          const data = await response.json();
          setHsnCodes(data);
        }
      } catch (error) {
        console.error("Error fetching HSN codes:", error);
      }
    };

    fetchHsnCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const productData = {
      product_name: productName,
      type: productType,
      category: category,
      hsn_code: hsn,
      sales_price: parseFloat(salesPrice),
      // sales_tax: parseFloat(salesTax),
      purchase_price: parseFloat(purchasePrice),
      purchase_tax: parseFloat(purchaseTax),
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Product created:", data)
        // Handle success (e.g., show a success message, redirect)
      } else {
        console.error("Failed to create product")
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <>
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Product Master</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <br />
              <Input
                id="name"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
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
                  <RadioGroupItem value="Goods" id="goods" />
                  <Label htmlFor="goods">Goods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Service" id="service" />
                  <Label htmlFor="service">Service</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Category</Label>
              <br />

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

            <div>
              <Label htmlFor="hsn">HSN/SAC Code</Label>
              <br />

              <Input
                id="hsn"
                placeholder="Search HSN/SAC code"
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
                list="hsn-codes"
              />
              <datalist id="hsn-codes">
                {hsnCodes.map((code) => (
                  <option key={code.hsn_code} value={code.hsn_code}>
                    {code.description}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="salesPrice">Sales Price</Label>
              <br />

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
              <br />

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
              <br />

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
              <br />

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
    </>
  )
}