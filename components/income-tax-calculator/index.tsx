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
  const [deduction80D, setDeduction80D] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  /**
   * Calculate income tax based on New Tax Regime for FY 2025-26 (AY 2026-27)
   * Applies progressive tax slabs, standard deduction, rebate u/s 87A, and 4% cess
   * Returns detailed breakdown including effective tax rate and slab-wise calculations
   */
  const calculateIncomeTax = () => {
    // Standard Deduction for salaried individuals (FY 2025-26)
    const STANDARD_DEDUCTION = 75000;
    
    // New Tax Regime Slabs for FY 2025-26 (AY 2026-27)
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

    // Calculate total deductions from user inputs
    const totalDeductions = deduction80C + deduction80D + otherDeductions;
    
    // Calculate taxable income: Gross Income - Standard Deduction - Other Deductions
    // Standard deduction (₹75,000) is automatically applied for salaried individuals
    const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION - totalDeductions);

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

    // Rebate under Section 87A and Marginal Relief for FY 2025-26
    // Income after standard deduction ≤ ₹12,00,000 → Full rebate (₹0 tax)
    // Income slightly above ₹12,00,000 → Marginal relief applies (tax capped at excess)
    const incomeAfterStandardDeduction = grossIncome - STANDARD_DEDUCTION;
    const rebateThreshold = 1200000;
    
    let rebateAmount = 0;
    let finalTax = totalTaxWithCess;
    
    if (incomeAfterStandardDeduction <= rebateThreshold) {
      // Full rebate u/s 87A if income after standard deduction ≤ ₹12L
      rebateAmount = totalTaxWithCess;
      finalTax = 0;
    } else {
      // Marginal relief: Tax cannot exceed income above ₹12L threshold
      const excessIncome = incomeAfterStandardDeduction - rebateThreshold;
      if (totalTaxWithCess > excessIncome) {
        // Apply marginal relief - tax limited to excess income
        finalTax = excessIncome;
        rebateAmount = totalTaxWithCess - excessIncome;
      }
    }

    // Calculate net income after tax deduction
    const netIncome = grossIncome - finalTax;
    // Calculate effective tax rate (total tax as percentage of gross income)
    const effectiveTaxRate = grossIncome > 0 ? (finalTax / grossIncome) * 100 : 0;

    return {
      grossIncome: Math.round(grossIncome),
      standardDeduction: STANDARD_DEDUCTION,
      totalDeductions: Math.round(totalDeductions),
      taxableIncome: Math.round(taxableIncome),
      totalTax: Math.round(finalTax),
      rebateAmount: Math.round(rebateAmount),
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
          standardDeduction={results.standardDeduction}
          totalDeductions={results.totalDeductions}
          taxableIncome={results.taxableIncome}
          totalTax={results.totalTax}
          rebateAmount={results.rebateAmount}
          netIncome={results.netIncome}
          effectiveTaxRate={results.effectiveTaxRate}
          taxSlabBreakdown={results.taxSlabBreakdown}
        />
      </div>
    </div>
  );
}
