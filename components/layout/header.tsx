// components/layout/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";

const routeTitles: Record<string, string> = {
  "/": "Financial Calculators",
  "/sip-calculator": "SIP Calculator",
  "/swp-calculator": "SWP Calculator",
  "/swp-stepup-calculator": "SWP Step Up Calculator",
  "/stepup-sip-calculator": "Step Up SIP Calculator",
  "/lumpsum-calculator": "Lumpsum Calculator",
  "/emi-calculator": "EMI Calculator",
  "/emi-stepup-calculator": "EMI Step Up Calculator",
  "/income-tax-calculator": "Income Tax Calculator",
};

export function Header() {
  const pathname = usePathname();
  const title = routeTitles[pathname] || "Financial Calculators";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold">
          {title}
        </Link>

        {/* Desktop Nav */}
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link href="#projects" className="text-sm text-muted-foreground hover:text-foreground">
            Projects
          </Link>
          <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav> */}

        {/* CTA & Theme Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* <Button className="hidden md:inline-flex">
            Hire Me
          </Button> */}
        </div>
      </div>
    </header>
  );
}
