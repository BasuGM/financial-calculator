"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, type TaxSlabBreakdown } from "./results-card";

/**
 * IncomeTaxCalculator Component
 * Main component that manages the state and calculations for the Income Tax calculator.
 * Calculates tax liability based on the New Tax Regime for FY 2025-26,
 * including slab-wise tax breakdown and 4% cess on total tax.
 */
export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deduction80C, setDeduction80C] = useState(0);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [otherDeductions, setOtherDeductions] = useState(50000);

  /**
   * Calculate income tax based on New Tax Regime
   * Applies progressive tax slabs, calculates tax for each slab, and adds 4% cess
   * Returns detailed breakdown including effective tax rate and slab-wise calculations
   */
  const calculateIncomeTax = () => {
    // New Tax Regime Slabs for FY 2023-24 (updated for FY 2025-26)
    // These slabs apply progressive taxation where each slab is taxed at its respective rate
    const taxSlabs = [
      { min: 0, max: 400000, rate: 0 },           // Up to ₹4L: No tax
      { min: 400000, max: 800000, rate: 5 },      // ₹4L - ₹8L: 5%
      { min: 800000, max: 1200000, rate: 10 },    // ₹8L - ₹12L: 10%
      { min: 1200000, max: 1600000, rate: 15 },   // ₹12L - ₹16L: 15%
      { min: 1600000, max: 2000000, rate: 20 },   // ₹16L - ₹20L: 20%
      { min: 2000000, max: 2400000, rate: 25 },   // ₹20L - ₹24L: 25%
      { min: 2400000, max: Infinity, rate: 30 },  // Above ₹24L: 30%
    ];

    // Calculate total deductions and taxable income
    const totalDeductions = deduction80C + deduction80D + otherDeductions;
    // Taxable income is gross income minus all deductions (cannot be negative)
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // Calculate tax slab-wise using progressive taxation
    const taxSlabBreakdown: TaxSlabBreakdown[] = [];
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    // Iterate through each tax slab to calculate tax progressively
    for (const slab of taxSlabs) {
      // Stop if no income left to tax
      if (remainingIncome <= 0) break;

      // Calculate how much income falls in this slab
      const slabIncome = Math.min(
        remainingIncome,
        slab.max === Infinity ? remainingIncome : slab.max - slab.min
      );

      // Calculate tax for this slab's income at the slab's rate
      const slabTax = (slabIncome * slab.rate) / 100;
      totalTax += slabTax;

      // Store breakdown data only if there's income in this slab
      if (slabIncome > 0) {
        // Format slab label for display (e.g., "₹4L - ₹8L" or "Above ₹24L")
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

      // Move to next slab with remaining income
      remainingIncome -= slabIncome;
    }

    // Add 4% Health and Education Cess on total tax (mandatory)
    const cess = totalTax * 0.04;
    const totalTaxWithCess = totalTax + cess;

    // Calculate net income after tax deduction
    const netIncome = grossIncome - totalTaxWithCess;
    // Calculate effective tax rate (total tax as percentage of gross income)
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
