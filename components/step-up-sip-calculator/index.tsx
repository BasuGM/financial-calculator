"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, YearlyBreakdown } from "./results-card";

/**
 * Main Step Up SIP Calculator component that manages state and coordinates between
 * input controls and results display. Calculates SIP returns with annual investment
 * increases, tracking year-by-year growth with compounding effects.
 */
export default function StepupSipCalculator() {
  // Default values: ₹25,000 monthly, 12% annual return, 10 years, 10% annual step-up
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [annualStepUp, setAnnualStepUp] = useState(10);

  /**
   * Calculate Step Up SIP returns by simulating monthly investments that increase
   * annually by a fixed percentage. Applies compound interest on the growing balance.
   * Formula combines standard SIP compounding with annual investment increases.
   */
  const calculateStepUpSIP = () => {
    // Convert annual rate to monthly rate
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let totalInvestment = 0;
    let futureValue = 0;
    let currentMonthlyInvestment = monthlyInvestment; // Track increasing investment amount

    // Generate year-by-year breakdown for table and chart visualization
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let runningBalance = 0;
    let runningInvestment = 0;

    for (let year = 1; year <= timePeriod; year++) {
      let yearInvestment = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        // Increase investment at the start of each year (except first year)
        // Step-up is applied annually, not monthly
        if (year > 1 && month === 1) {
          currentMonthlyInvestment = currentMonthlyInvestment * (1 + annualStepUp / 100);
        }

        // Track total investment and yearly investment
        totalInvestment += currentMonthlyInvestment;
        yearInvestment += currentMonthlyInvestment;
        // Apply monthly compounding: (previous balance + new investment) × (1 + monthly rate)
        futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
      }

      // Aggregate yearly totals for breakdown display
      runningInvestment += yearInvestment;
      runningBalance = futureValue;
      // Interest earned is the difference between total value and amount invested
      const interestEarned = runningBalance - runningInvestment;

      yearlyBreakdown.push({
        year,
        investment: Math.round(yearInvestment),
        totalInvested: Math.round(runningInvestment),
        interestEarned: Math.round(interestEarned),
        yearEndValue: Math.round(runningBalance),
      });
    }

    const estimatedReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      yearlyBreakdown,
    };
  };

  const results = calculateStepUpSIP();

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
          annualStepUp={annualStepUp}
          setAnnualStepUp={setAnnualStepUp}
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
