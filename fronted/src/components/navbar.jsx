"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Purchase Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Purchase</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[300px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/purchase-order">Purchase Order</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/vendorbill">Purchase Bill</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/payment">Payment</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Sale Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sale</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[300px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/sales-order">Sale Order</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/sales-invoice">Sale Invoice</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/payment">Receipt</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Report Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Report</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[300px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/profit-loss">Profit & Loss</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/admin/balance-sheet">Balance Sheet</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/stock-statement">Stock Statement</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
