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

export default function ProductList() {
  const router = useRouter()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          console.error("Failed to fetch products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [router])

  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => router.push("/admin/forms/product/create")}>
          Create Product
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>Sales Price</TableHead>
            <TableHead>Purchase Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id+1000 || product.product_name}>
              <TableCell>{product.product_name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.hsn_code}</TableCell>
              <TableCell>{product.sales_price}</TableCell>
              <TableCell>{product.purchase_price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}