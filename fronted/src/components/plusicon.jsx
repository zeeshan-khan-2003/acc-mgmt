"use client";
import { useState } from "react";
import {  X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function StickyExpandableButton() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Contact", onClick: () => alert("Card clicked") },
    { label: "Product", onClick: () => alert("Product clicked") },
    { label: "Taxes", onClick: () => alert("Taxes clicked") },
    { label: "COA", onClick: () => alert("COA clicked") },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 z-50">
      {/* Expanded buttons */}
      {items.map((item, index) => {
        // For animation delay to stagger buttons (optional)
        const delay = `${index * 75}ms`;

        return (
          <button
            key={item.label}
            className={`
              ${buttonVariants({ variant: "default" })} w-32
              transform transition-all duration-300 ease-in-out
              ${
                open
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }
            `}
            style={{ transitionDelay: delay }}
            onClick={() => {
              item.onClick();
              setOpen(false);
            }}
          >
            {item.label}
          </button>
        );
      })}

      {/* Main toggle button */}
      <button
        className={`${buttonVariants({ variant: "default" })} rounded-full w-14 h-14 flex items-center justify-center shadow-lg`}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-6 h-6" /> : <p className="w-6 h-6">Add</p>}
      </button>
    </div>
  );
}
