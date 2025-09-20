"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
export default function ChartOfAccounts() {
    const router = useRouter()

  const [accounts, setAccounts] = useState([])
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState("")
  const [open, setOpen] = useState(false)

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/chart-of-accounts", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
      } else {
        console.error("Failed to fetch accounts")
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const addAccount = async () => {
    if (accountName && accountType) {
      const newAccount = { account_name: accountName, type: accountType }
      try {
        const response = await fetch("http://127.0.0.1:5000/api/chart-of-accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(newAccount),
        })

        if (response.ok) {
          setAccountName("")
          setAccountType("")
          fetchAccounts() // Refetch accounts after adding a new one
          setOpen(false) // Close the dialog
        } else {
          console.error("Failed to add account")
        }
      } catch (error) {
        console.error("Error adding account:", error)
      }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">

          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">New</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Enter account name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select onValueChange={setAccountType} value={accountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asset">Asset</SelectItem>
                        <SelectItem value="Liability">Liability</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                        <SelectItem value="Equity">Equity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addAccount}>Add Account</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="default">Confirm</Button>
            <Button variant="destructive">Archived</Button>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-2">
            <Button onClick={() => router.push("/admin")}>Home</Button>
            <Button onClick={() => router.back()}>Back</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No accounts added yet.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((acc, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{acc.account_name}</TableCell>
                    <TableCell>{acc.type}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
