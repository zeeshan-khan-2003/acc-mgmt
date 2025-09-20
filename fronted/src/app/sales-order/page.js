"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import Formbar from "@/components/formsbar"

export default function SalesOrderForm({ onCancel }) {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [customerId, setCustomerId] = useState("")
  const [refNumber, setRefNumber] = useState("")
  const [soNumber, setSONumber] = useState("")
  const [items, setItems] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      try {
        const [customersResponse, productsResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/contacts', { headers }),
          fetch('http://127.0.0.1:5000/api/products', { headers })
        ]);

        if (customersResponse.ok) {
          const allContacts  = await customersResponse.json();
          setCustomers(allContacts);
        } else {
          console.error("Failed to fetch customers");
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }

      setSONumber(
        `SO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      )
    }
    loadData()
  }, [router])

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: products.length > 0 ? products[0].product_id : 0,
        quantity: 1,
        unit_price: products.length > 0 ? products[0].sales_price : 0,
        untaxed_amount: products.length > 0 ? products[0].sales_price : 0,
        tax_rate: 5,
        tax_amount: 0,
        total_price: 0
      }
    ])
  }

  const removeItem = index => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "product_id") {
      const product = products.find(p => p.product_id === value)
      if (product) {
        updatedItems[index].product_id = product.product_id
        updatedItems[index].unit_price = product.sales_price
        updatedItems[index].product_name = product.product_name
      }
    }

    const quantity = Number(updatedItems[index].quantity) || 0
    const unit_price = Number(updatedItems[index].unit_price) || 0
    const tax_rate = Number(updatedItems[index].tax_rate) || 0

    updatedItems[index].untaxed_amount = quantity * unit_price
    updatedItems[index].tax_amount = (updatedItems[index].untaxed_amount * tax_rate) / 100
    updatedItems[index].total_price = updatedItems[index].untaxed_amount + updatedItems[index].tax_amount

    setItems(updatedItems)
  }

  const calculateTotals = () => {
    const totalUntaxed = items.reduce((sum, item) => sum + item.untaxed_amount, 0)
    const totalTax = items.reduce((sum, item) => sum + item.tax_amount, 0)
    const grandTotal = totalUntaxed + totalTax
    return { totalUntaxed, totalTax, grandTotal }
  }
  const handleCreateSalesOrder = async (salesOrderData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://127.0.0.1:5000/api/sales-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(salesOrderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Sales order created successfully! SO ID: ${data.so_id}`);
        router.push('/sales-invoice?so_id=' + data.so_id);
      } else {
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Failed to create sales order:", error);
      alert("Failed to create sales order. See console for details.");
    }
  };

  const handleSubmit = e => {
    e.preventDefault()

    if (!customerId || items.length === 0) return

    if (refNumber && !/^[a-zA-Z0-9\-]+$/.test(refNumber)) {
      alert("Reference number must be alphanumeric")
      return
    }

    const { totalUntaxed, totalTax, grandTotal } = calculateTotals()

    handleCreateSalesOrder({
      so_number: soNumber,
      customer_id: customerId,
      ref_no: refNumber.trim(),
      total_amount: grandTotal,
      items: items.map(({ product_id, quantity, unit_price, tax_id }) => ({
        product_id,
        quantity,
        unit_price,
        tax_id
      }))
    })
  }

  const { totalUntaxed, totalTax, grandTotal } = calculateTotals()

  return (<>
    <Formbar />
    <br />
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-balance">Create Sales Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="so-number">SO Number</Label>
              <Input
                id="so-number"
                value={soNumber}
                onChange={e => setSONumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
                <Select onValueChange={setCustomerId} value={customerId}>
                    <SelectTrigger id="customer-name">
                        <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(customer => (
                            <SelectItem key={customer.contact_id} value={customer.contact_id.toString()}>
                                {customer.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref-number">Reference Number</Label>
              <Input
                id="ref-number"
                value={refNumber}
                onChange={e => setRefNumber(e.target.value)}
                placeholder="Alphanumeric reference"
                pattern="[a-zA-Z0-9\-]*"
                title="Alphanumeric characters and dashes only"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

           {items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Product</Label>
                        <Select
                        value={item.product_id.toString()}
                        onValueChange={value => updateItem(index, "product_id", Number(value))}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(product => (
                            <SelectItem
                                key={product.product_id}
                                value={product.product_id.toString()}
                            >
                                {product.product_name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(index, "quantity", Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Unit Price</Label>
                        <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={e => updateItem(index, "unit_price", Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Untaxed Amount</Label>
                        <Input
                        type="number"
                        step="0.01"
                        value={item.untaxed_amount.toFixed(2)}
                        readOnly
                        className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tax (%)</Label>
                        <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.tax_rate}
                        onChange={e => updateItem(index, "tax_rate", Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tax Amount</Label>
                        <Input
                        type="number"
                        step="0.01"
                        value={item.tax_amount.toFixed(2)}
                        readOnly
                        className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                        type="number"
                        step="0.01"
                        value={item.total_price.toFixed(2)}
                        readOnly
                        className="bg-muted"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal (Untaxed):</span>
                  <span>${totalUntaxed.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span>${totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={!customerId || items.length === 0}>
              Create Sales Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </>)
}
