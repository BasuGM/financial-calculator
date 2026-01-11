"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, type YearlyBreakdown } from "./results-card";

/**
 * LumpsumCalculator Component
 * Main component that manages the state and calculations for the lumpsum investment calculator.
 * A lumpsum investment is a one-time investment where the entire amount is invested at once
 * and grows through compounding over the specified time period.
 */
export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  /**
   * Calculate lumpsum investment returns
   * Uses compound interest formula: FV = PV × (1 + r)^n
   * where FV = Future Value, PV = Present Value, r = annual rate, n = years
   */
  const calculateLumpsum = () => {
    // Convert percentage to decimal for calculations
    const annualRate = expectedReturn / 100;
    
    // Calculate year-by-year growth to show progression
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let currentValue = totalInvestment;

    // Iterate through each year to calculate compounding growth
    for (let year = 1; year <= timePeriod; year++) {
      const yearStartValue = currentValue;
      // Calculate interest earned for this year
      const interestEarned = currentValue * annualRate;
      // Apply compound interest: previous value × (1 + rate)
      const yearEndValue = currentValue * (1 + annualRate);
      
      yearlyBreakdown.push({
        year,
        yearStartValue: Math.round(yearStartValue),
        interestEarned: Math.round(interestEarned),
        yearEndValue: Math.round(yearEndValue),
      });
      
      // Update current value for next iteration
      currentValue = yearEndValue;
    }

    // Calculate final future value using compound interest formula
    const futureValue = totalInvestment * Math.pow(1 + annualRate, timePeriod);
    // Calculate total returns earned (future value minus original investment)
    const estimatedReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      yearlyBreakdown,
    };
  };

  const results = calculateLumpsum();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          totalInvestment={totalInvestment}
          setTotalInvestment={setTotalInvestment}
          expectedReturn={expectedReturn}
          setExpectedReturn={setExpectedReturn}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        <ResultsCard
          totalInvestment={results.totalInvestment}
          estimatedReturns={results.estimatedReturns}
          futureValue={results.futureValue}
          yearlyBreakdown={results.yearlyBreakdown}
        />
      </div>
    </div>
  );
}
