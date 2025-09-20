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

export default function PurchaseOrderForm({ onCancel }) {
  const router = useRouter()
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [vendorName, setVendorName] = useState("")
  const [refNumber, setRefNumber] = useState("")
  const [poNumber, setPONumber] = useState("")
  const [items, setItems] = useState([])
  // Removed global taxRate, since tax is now per item

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
        const [vendorsResponse, productsResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/contacts', { headers }),
          fetch('http://127.0.0.1:5000/api/products', { headers })
        ]);

        if (vendorsResponse.ok) {
          const allContacts  = await vendorsResponse.json();
          setVendors(allContacts);
        } else {
          console.error("Failed to fetch vendors");
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

      setPONumber(
        `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
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
        unit_price: products.length > 0 ? products[0].purchase_price : 0,
        untaxed_amount: products.length > 0 ? products[0].purchase_price : 0,
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
        updatedItems[index].unit_price = product.purchase_price
        updatedItems[index].product_name = product.product_name
      }
    }

    // Ensure quantity and unit_price are numbers and default to 0 if invalid
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
  const handleCreatePurchaseOrder = async (purchaseOrderData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(token)
      const response = await fetch('http://127.0.0.1:5000/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(purchaseOrderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Purchase order created successfully! PO ID: ${data.po_id}`);

        // Save needed data to localStorage
        const billData = {
          billNo: data.po_id,
          vendorName: purchaseOrderData.vendorName,
          reference: purchaseOrderData.reference,
          products: purchaseOrderData.products
        };

        localStorage.setItem('vendorBillData', JSON.stringify(billData));

        // Redirect
        router.push('/vendorbill?po_id=' + data.po_id);
      } else {
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Failed to create purchase order:", error);
      alert("Failed to create purchase order. See console for details.");
    }
  };

  const handleSubmit = e => {
    e.preventDefault()

    if (!vendorName.trim() || items.length === 0) return

    if (refNumber && !/^[a-zA-Z0-9\-]+$/.test(refNumber)) {
      alert("Reference number must be alphanumeric")
      return
    }

    const { totalUntaxed, totalTax, grandTotal } = calculateTotals()

    handleCreatePurchaseOrder({
      po_number: poNumber,
      vendor_name: vendorName.trim(),
      ref_no: refNumber.trim(),
      total_amount: totalUntaxed,
      tax_rate: null, // no global tax rate now, tax per item
      tax_amount: totalTax,
      grand_total: grandTotal,
      status: "draft",
      items: items.map(({ product_id, quantity, unit_price, tax_rate }) => ({
        product_id,
        quantity,
        unit_price,
        tax_rate
      }))
    })
  }

  const { totalUntaxed, totalTax, grandTotal } = calculateTotals()

  return (<>
          <title>PO page</title>


<Formbar />
<br />
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-balance">Create Purchase Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number</Label>
              <Input
                id="po-number"
                value={poNumber}
                onChange={e => setPONumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
                <Select onValueChange={setVendorName} value={vendorName}>
                    <SelectTrigger id="vendor-name">
                        <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                        {vendors.map(vendor => (
                            <SelectItem key={vendor.contact_id} value={vendor.name}>
                                {vendor.name}
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
                      onValueChange={value =>
                        updateItem(index, "product_id", Number(value))
                      }
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
                      onChange={e =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={e =>
                        updateItem(index, "unit_price", Number(e.target.value))
                      }
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
                      onChange={e =>
                        updateItem(index, "tax_rate", Number(e.target.value))
                      }
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!vendorName.trim() || items.length === 0}>
              Create Purchase Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card></>
  )
}
