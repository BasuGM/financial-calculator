"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, YearlyBreakdown } from "./results-card";

/**
 * Main SIP Calculator component that manages state and coordinates between
 * input controls and results display with year-by-year breakdown.
 */
export default function SipCalculator() {
  // Default values: ₹25,000 monthly, 12% annual return, 10 years
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  /**
   * Calculate SIP returns using the compound interest formula for regular investments.
   * Formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
   * where P = monthly investment, r = monthly rate, n = number of months
   */
  const calculateSIP = () => {
    // Convert annual rate to monthly rate
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    
    // Calculate future value - handle edge case when rate is 0 (no returns)
    let futureValue;
    if (monthlyRate === 0) {
      futureValue = monthlyInvestment * months;
    } else {
      // Standard SIP formula with compounding
      futureValue =
        monthlyInvestment *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));
    }
    
    // Calculate total invested and returns
    const totalInvestment = monthlyInvestment * months;
    const estimatedReturns = futureValue - totalInvestment;

    // Generate year-by-year breakdown for table and chart visualization
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let runningBalance = 0;
    let runningInvestment = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const monthsInYear = year * 12;
      
      // Calculate cumulative value at end of each year
      let yearEndValue;
      if (monthlyRate === 0) {
        yearEndValue = monthlyInvestment * monthsInYear;
      } else {
        yearEndValue =
          monthlyInvestment *
          (((Math.pow(1 + monthlyRate, monthsInYear) - 1) / monthlyRate) *
            (1 + monthlyRate));
      }

      // Track annual investment and cumulative values
      const yearInvestment = monthlyInvestment * 12;
      runningInvestment += yearInvestment;
      const previousBalance = runningBalance;
      runningBalance = yearEndValue;
      // Interest earned is the difference between total value and amount invested
      const interestEarned = runningBalance - runningInvestment;

      yearlyBreakdown.push({
        year,
        investment: yearInvestment,
        totalInvested: Math.round(runningInvestment),
        interestEarned: Math.round(interestEarned),
        yearEndValue: Math.round(runningBalance),
      });
    }

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      yearlyBreakdown,
    };
  };

  const results = calculateSIP();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          monthlyInvestment={monthlyInvestment}
          setMonthlyInvestment={setMonthlyInvestment}
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
