"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

interface TaxSlabBreakdown {
  slab: string;
  income: number;
  rate: number;
  tax: number;
}

interface ResultsCardProps {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  taxSlabBreakdown: TaxSlabBreakdown[];
}

function ResultsCard({
  grossIncome,
  totalDeductions,
  taxableIncome,
  totalTax,
  netIncome,
  effectiveTaxRate,
  taxSlabBreakdown,
}: ResultsCardProps) {
  const taxPercentage = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const netPercentage = grossIncome > 0 ? (netIncome / grossIncome) * 100 : 0;
  const centerText = `${effectiveTaxRate.toFixed(1)}% Tax Rate`;

  // Prepare data for table dialog
  const tableColumns = [
    { key: "slab", label: "Income Slab", align: "left" as const, minWidth: "150px" },
    { key: "income", label: "Taxable Income", align: "right" as const, minWidth: "140px" },
    { key: "rate", label: "Tax Rate", align: "right" as const, minWidth: "100px", className: "text-orange-600" },
    { key: "tax", label: "Tax Amount", align: "right" as const, minWidth: "130px", className: "font-semibold" },
  ];

  const tableData = taxSlabBreakdown.map((row) => ({
    slab: row.slab,
    income: row.income,
    rate: row.rate,
    tax: row.tax,
  }));

  const formatCell = (key: string, value: any, rowIndex: number) => {
    if (key === "slab") {
      return value;
    }
    if (key === "rate") {
      return `${value}%`;
    }
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  const highlightRow = (rowIndex: number) => {
    return false; // No highlighting for tax slabs
  };

  // Prepare data for chart dialog
  const chartData = [
    { category: "Income Flow", deductions: totalDeductions, tax: totalTax, netIncome: netIncome },
  ];

  const chartLines = [
    {
      dataKey: "deductions",
      name: "Deductions",
      color: "#3b82f6",
      gradientId: "colorDeductions",
    },
    {
      dataKey: "tax",
      name: "Tax",
      color: "#f59e0b",
      gradientId: "colorTax",
    },
    {
      dataKey: "netIncome",
      name: "Net Income",
      color: "#22c55e",
      gradientId: "colorNetIncome",
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const formatTooltip = (value: number | undefined) =>
    value !== undefined ? `₹${value.toLocaleString("en-IN")}` : "";

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Gross Annual Income</span>
            <span className="font-semibold text-foreground">
              ₹ {grossIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Deductions</span>
            <span className="font-semibold text-blue-600">
              ₹ {totalDeductions.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxable Income</span>
            <span className="font-semibold text-foreground">
              ₹ {taxableIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Tax</span>
            <span className="font-semibold text-orange-600">
              ₹ {totalTax.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Net Annual Income</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {netIncome.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            <span>Effective Tax Rate</span>
            <span className="font-semibold text-foreground">
              {effectiveTaxRate.toFixed(2)}%
            </span>
          </div>
        </div>

        <ProgressBar
          leftPercentage={netPercentage}
          rightPercentage={taxPercentage}
          centerText={centerText}
          leftLabel="Net Income"
          rightLabel="Tax"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Tax Slab Breakdown"
            title="Tax Slab Breakdown"
            description="Detailed calculation across different income tax slabs"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />          
        </div>
      </CardContent>
    </Card>
  );
}

interface InputsCardProps {
  grossIncome: number;
  setGrossIncome: (value: number) => void;
  deduction80C: number;
  setDeduction80C: (value: number) => void;
  deduction80D: number;
  setDeduction80D: (value: number) => void;
  otherDeductions: number;
  setOtherDeductions: (value: number) => void;
}

function InputsCard({
  grossIncome,
  setGrossIncome,
  deduction80C,
  setDeduction80C,
  deduction80D,
  setDeduction80D,
  otherDeductions,
  setOtherDeductions,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Income Tax Calculator</CardTitle>
        <CardDescription>
          Calculate your income tax liability (New Tax Regime FY 2025-26)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          id="gross-income"
          label="Gross annual income"
          value={grossIncome}
          onChange={setGrossIncome}
          min={0}
          max={100000000}
          step={10000}
          prefix="₹"
        />

        <InputField
          id="deduction-80c"
          label="Deduction under 80C"
          value={deduction80C}
          onChange={setDeduction80C}
          min={0}
          max={150000}
          step={10000}
          prefix="₹"
        />

        <InputField
          id="deduction-80d"
          label="Deduction under 80D"
          value={deduction80D}
          onChange={setDeduction80D}
          min={0}
          max={100000}
          step={5000}
          prefix="₹"
        />

        <InputField
          id="other-deductions"
          label="Other deductions"
          value={otherDeductions}
          onChange={setOtherDeductions}
          min={0}
          max={500000}
          step={10000}
          prefix="₹"
        />
      </CardContent>
    </Card>
  );
}

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deduction80C, setDeduction80C] = useState(0);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [otherDeductions, setOtherDeductions] = useState(50000);

  const calculateIncomeTax = () => {
    // New Tax Regime Slabs (FY 2023-24)
    const taxSlabs = [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 5 },
      { min: 800000, max: 1200000, rate: 10 },
      { min: 1200000, max: 1600000, rate: 15 },
      { min: 1600000, max: 2000000, rate: 20 },
      { min: 2000000, max: 2400000, rate: 25 },
      { min: 2400000, max: Infinity, rate: 30 },
    ];

    const totalDeductions = deduction80C + deduction80D + otherDeductions;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // Calculate tax slab-wise
    const taxSlabBreakdown: TaxSlabBreakdown[] = [];
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    for (const slab of taxSlabs) {
      if (remainingIncome <= 0) break;

      const slabIncome = Math.min(
        remainingIncome,
        slab.max === Infinity ? remainingIncome : slab.max - slab.min
      );

      const slabTax = (slabIncome * slab.rate) / 100;
      totalTax += slabTax;

      if (slabIncome > 0) {
        const slabLabel =
          slab.max === Infinity
            ? `Above ₹${(slab.min / 100000).toFixed(0)}L`
            : `₹${(slab.min / 100000).toFixed(0)}L - ₹${(slab.max / 100000).toFixed(0)}L`;

        taxSlabBreakdown.push({
          slab: slabLabel,
          income: Math.round(slabIncome),
          rate: slab.rate,
          tax: Math.round(slabTax),
        });
      }

      remainingIncome -= slabIncome;
    }

    // Add 4% cess on total tax
    const cess = totalTax * 0.04;
    const totalTaxWithCess = totalTax + cess;

    const netIncome = grossIncome - totalTaxWithCess;
    const effectiveTaxRate = grossIncome > 0 ? (totalTaxWithCess / grossIncome) * 100 : 0;

    return {
      grossIncome: Math.round(grossIncome),
      totalDeductions: Math.round(totalDeductions),
      taxableIncome: Math.round(taxableIncome),
      totalTax: Math.round(totalTaxWithCess),
      netIncome: Math.round(netIncome),
      effectiveTaxRate,
      taxSlabBreakdown,
    };
  };

  const results = calculateIncomeTax();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          grossIncome={grossIncome}
          setGrossIncome={setGrossIncome}
          deduction80C={deduction80C}
          setDeduction80C={setDeduction80C}
          deduction80D={deduction80D}
          setDeduction80D={setDeduction80D}
          otherDeductions={otherDeductions}
          setOtherDeductions={setOtherDeductions}
        />

        <ResultsCard
          grossIncome={results.grossIncome}
          totalDeductions={results.totalDeductions}
          taxableIncome={results.taxableIncome}
          totalTax={results.totalTax}
          netIncome={results.netIncome}
          effectiveTaxRate={results.effectiveTaxRate}
          taxSlabBreakdown={results.taxSlabBreakdown}
        />
      </div>
    </div>
  );
}
