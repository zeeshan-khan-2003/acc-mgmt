// Mock data storage
const mockVendors = [
  {
    id: 1,
    name: "ABC Supplies Ltd",
    email: "contact@abcsupplies.com",
    phone: "+1-555-0101",
    address: "123 Industrial Ave",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Tech Components Inc",
    email: "sales@techcomponents.com",
    phone: "+1-555-0102",
    address: "456 Tech Park Blvd",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
]

const mockCustomers = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "purchasing@acme.com",
    phone: "+1-555-0201",
    address: "100 Corporate Plaza",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Global Enterprises",
    email: "orders@globalent.com",
    phone: "+1-555-0202",
    address: "200 Enterprise Way",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
]

const mockProducts = [
  {
    id: 1,
    name: "Office Chair",
    description: "Ergonomic office chair",
    unit_price: 299.99,
    stock_quantity: 50,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Laptop Computer",
    description: "Business laptop",
    unit_price: 1299.99,
    stock_quantity: 25,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  },
  {
    id: 3,
    name: "Printer Paper",
    description: "A4 white paper",
    unit_price: 12.99,
    stock_quantity: 200,
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
]

const mockPurchaseOrders = [
  {
    id: 1,
    po_number: "PO-2024-001",
    vendor_id: 1,
    total_amount: 1000.0,
    tax_rate: 10.0,
    tax_amount: 100.0,
    grand_total: 1100.0,
    status: "sent",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
]

const mockSalesOrders = [
  {
    id: 1,
    so_number: "SO-2024-001",
    customer_id: 1,
    total_amount: 1500.0,
    tax_rate: 5.0,
    tax_amount: 75.0,
    grand_total: 1575.0,
    status: "confirmed",
    created_at: "2024-01-01",
    updated_at: "2024-01-01"
  }
]

const mockVendorBills = []
const mockCustomerInvoices = []
const mockPayments = []

// Database functions
export const db = {
  // Vendors
  getVendors: async () => mockVendors,
  getVendor: async id => mockVendors.find(v => v.id === id) || null,
  createVendor: async vendor => {
    const newVendor = {
      ...vendor,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockVendors.push(newVendor)
    return newVendor
  },

  // Customers
  getCustomers: async () => mockCustomers,
  getCustomer: async id => mockCustomers.find(c => c.id === id) || null,
  createCustomer: async customer => {
    const newCustomer = {
      ...customer,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockCustomers.push(newCustomer)
    return newCustomer
  },

  // Products
  getProducts: async () => mockProducts,
  getProduct: async id => mockProducts.find(p => p.id === id) || null,
  createProduct: async product => {
    const newProduct = {
      ...product,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockProducts.push(newProduct)
    return newProduct
  },

  // Purchase Orders
  getPurchaseOrders: async () => {
    return mockPurchaseOrders.map(po => ({
      ...po,
      vendor: mockVendors.find(v => v.id === po.vendor_id)
    }))
  },
  createPurchaseOrder: async po => {
    const newPO = {
      ...po,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockPurchaseOrders.push(newPO)
    return newPO
  },

  // Sales Orders
  getSalesOrders: async () => {
    return mockSalesOrders.map(so => ({
      ...so,
      customer: mockCustomers.find(c => c.id === so.customer_id)
    }))
  },
  createSalesOrder: async so => {
    const newSO = {
      ...so,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockSalesOrders.push(newSO)
    return newSO
  },

  // Vendor Bills
  getVendorBills: async () => {
    return mockVendorBills.map(bill => ({
      ...bill,
      vendor: mockVendors.find(v => v.id === bill.vendor_id),
      purchase_order: mockPurchaseOrders.find(po => po.id === bill.po_id)
    }))
  },
  createVendorBill: async bill => {
    const newBill = {
      ...bill,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockVendorBills.push(newBill)
    return newBill
  },

  // Customer Invoices
  getCustomerInvoices: async () => {
    return mockCustomerInvoices.map(invoice => ({
      ...invoice,
      customer: mockCustomers.find(c => c.id === invoice.customer_id),
      sales_order: mockSalesOrders.find(so => so.id === invoice.so_id)
    }))
  },
  createCustomerInvoice: async invoice => {
    const newInvoice = {
      ...invoice,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockCustomerInvoices.push(newInvoice)
    return newInvoice
  },

  // Payments
  getPayments: async () => mockPayments,
  createPayment: async payment => {
    const newPayment = {
      ...payment,
      id: Date.now(),
      created_at: new Date().toISOString()
    }
    mockPayments.push(newPayment)
    return newPayment
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const totalSales = mockSalesOrders.reduce(
      (sum, so) => sum + so.grand_total,
      0
    )
    const totalPurchases = mockPurchaseOrders.reduce(
      (sum, po) => sum + po.grand_total,
      0
    )
    const pendingInvoices = mockCustomerInvoices.filter(
      inv => inv.status === "pending"
    ).length
    const pendingBills = mockVendorBills.filter(
      bill => bill.status === "pending"
    ).length

    return {
      totalSales,
      totalPurchases,
      pendingInvoices,
      pendingBills,
      totalCustomers: mockCustomers.length,
      totalVendors: mockVendors.length,
      totalProducts: mockProducts.length,
      recentTransactions: mockPayments.slice(-5).map(payment => ({
        ...payment,
        reference_name:
          payment.payment_type === "bill"
            ? "Vendor Payment"
            : "Customer Payment"
      }))
    }
  }
}
<------ page.js----->

"use client"
import { useState, useEffect } from "react"
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
import { db } from "@/lib/database"

export default function PurchaseOrderForm({ onSubmit, onCancel }) {
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  // Remove selectedVendor state
  // const [selectedVendor, setSelectedVendor] = useState(null)
  const [vendorName, setVendorName] = useState("")  // NEW: vendor name input state
  const [refNumber, setRefNumber] = useState("")    // NEW: reference number input state
  const [poNumber, setPONumber] = useState("")
  const [items, setItems] = useState([])
  const [taxRate, setTaxRate] = useState(5)

  useEffect(() => {
    const loadData = async () => {
      const [, productsData] = await Promise.all([
        db.getVendors(), // We don't actually need vendors now, but can keep if used elsewhere
        db.getProducts()
      ])
      setProducts(productsData)

      // Generate PO number
      setPONumber(
        `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      )
    }
    loadData()
  }, [])

  const addItem = () => {
    setItems([
      ...items,
      { product_id: 0, quantity: 1, unit_price: 0, total_price: 0 }
    ])
  }

  const removeItem = index => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "product_id") {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItems[index].product = product
        updatedItems[index].unit_price = product.unit_price
      }
    }

    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].total_price =
        updatedItems[index].quantity * updatedItems[index].unit_price
    }

    setItems(updatedItems)
  }

  const calculateTotals = () => {
    const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0)
    const taxAmount = (totalAmount * taxRate) / 100
    const grandTotal = totalAmount + taxAmount
    return { totalAmount, taxAmount, grandTotal }
  }

  const handleSubmit = e => {
    e.preventDefault()
    // Validate vendorName and items exist
    if (!vendorName.trim() || items.length === 0) return

    // Optional: Validate refNumber if needed, e.g. must be alphanumeric (simple regex)
    if (refNumber && !/^[a-zA-Z0-9\-]+$/.test(refNumber)) {
      alert("Reference number must be alphanumeric")
      return
    }

    const { totalAmount, taxAmount, grandTotal } = calculateTotals()

    onSubmit({
      po_number: poNumber,
      vendor_name: vendorName.trim(),  // sending vendor name instead of id
      ref_number: refNumber.trim(),    // sending new ref number field
      total_amount: totalAmount,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      status: "draft"
    })
  }

  const { totalAmount, taxAmount, grandTotal } = calculateTotals()

  return (
    <Card className="w-full max-w-4xl mx-auto">
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

            {/* Vendor Name as text input instead of dropdown */}
            <div className="space-y-2">
              <Label htmlFor="vendor-name">Vendor Name</Label>
              <Input
                id="vendor-name"
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
                required
              />
            </div>

            {/* New Reference Number field */}
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Select
                  value={taxRate.toString()}
                  onValueChange={value => setTaxRate(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!vendorName.trim() || items.length === 0}
            >
              Create Purchase Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
