"use client"

import { useState } from "react"
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

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([])
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState("")

  const addAccount = () => {
    if (accountName && accountType) {
      setAccounts([...accounts, { name: accountName, type: accountType }])
      setAccountName("")
      setAccountType("")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Chart of Accounts
          </CardTitle>
          <div className="flex gap-2">
            <Dialog>
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
                        <SelectItem value="Assets">Assets</SelectItem>
                        <SelectItem value="Liabilities">Liabilities</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addAccount}>Add Account</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="default">Confirm</Button>
            <Button variant="destructive">Archived</Button>
            <Button variant="outline">Home</Button>
            <Button variant="outline">Back</Button>
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
                    <TableCell>{acc.name}</TableCell>
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
