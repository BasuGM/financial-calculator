import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TbPigMoney, TbWallet, TbStairsUp, TbTrendingUp, TbCashBanknote, TbHome, TbCalculator, TbReceiptTax } from "react-icons/tb";
import { IconType } from "react-icons";

interface Calculator {
  title: string;
  description: string;
  icon: IconType;
  href: string;
}

const calculators: Calculator[] = [
  {
    title: "SIP Calculator",
    description: "Calculate returns on your Systematic Investment Plan",
    icon: TbPigMoney,
    href: "/sip-calculator",
  },
  {
    title: "SWP Calculator",
    description: "Plan your Systematic Withdrawal Plan",
    icon: TbWallet,
    href: "/swp-calculator",
  },
  {
    title: "SWP Step Up Calculator",
    description: "Calculate withdrawals with step-up increments",
    icon: TbStairsUp,
    href: "/swp-stepup-calculator",
  },
  {
    title: "Step Up SIP Calculator",
    description: "Calculate SIP with increasing contributions",
    icon: TbTrendingUp,
    href: "/stepup-sip-calculator",
  },
  {
    title: "Lumpsum Calculator",
    description: "Calculate returns on one-time investments",
    icon: TbCashBanknote,
    href: "/lumpsum-calculator",
  },
  {
    title: "EMI Calculator",
    description: "Calculate your loan EMI payments",
    icon: TbHome,
    href: "/emi-calculator",
  },
  {
    title: "EMI Step Up Calculator",
    description: "Calculate EMI with step-up payments",
    icon: TbCalculator,
    href: "/emi-stepup-calculator",
  },
  {
    title: "Income Tax Calculator",
    description: "Estimate your income tax liability",
    icon: TbReceiptTax,
    href: "/income-tax-calculator",
  },
];

function HeroSection() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Financial Calculators
      </h1>
      <p className="text-lg text-muted-foreground">
        Make informed financial decisions with our comprehensive calculators
      </p>
    </div>
  );
}

function CalculatorCard({ calculator }: { calculator: Calculator }) {
  const Icon = calculator.icon;
  
  return (
    <Link href={calculator.href}>
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer rounded-none">
        <CardHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{calculator.title}</CardTitle>
          <CardDescription>{calculator.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

function CalculatorGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {calculators.map((calculator) => (
        <CalculatorCard key={calculator.href} calculator={calculator} />
      ))}
    </div>
  );
}

export function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <HeroSection />
        <CalculatorGrid />
      </div>
    </main>
  );
}
