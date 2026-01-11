"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, YearlyBreakdown } from "./results-card";

/**
 * Main SWP Step Up Calculator component that manages state and coordinates between
 * input controls and results display. Calculates systematic withdrawals with annual
 * percentage increases, tracking fund depletion and partial withdrawals.
 */
export default function SwpStepupCalculator() {
  // Default values: ₹50,00,000 initial investment, ₹40,000 monthly withdrawal, 5% step-up, 10% return, 10 years
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(40000);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [timePeriod, setTimePeriod] = useState(10);

  /**
   * Calculate SWP Step Up by simulating monthly withdrawals that increase annually
   * by a fixed percentage. Tracks compound interest on remaining balance and
   * handles fund depletion with partial final withdrawal.
   */
  const calculateSWPStepUp = () => {
    // Convert annual rate to monthly rate
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let currentWithdrawal = monthlyWithdrawal; // Track increasing withdrawal amount
    let totalWithdrawnAmount = 0;
    let depletionMonth = null; // Track when fund runs out

    // Generate year-by-year breakdown for table and chart visualization
    const yearlyBreakdown: YearlyBreakdown[] = [];

    for (let year = 1; year <= timePeriod; year++) {
      const balanceStart = balance;
      let yearWithdrawal = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        if (balance > 0) {
          // Increase withdrawal at the start of each year (except first year)
          // Step-up is applied annually, not monthly
          if (year > 1 && month === 1) {
            currentWithdrawal = currentWithdrawal * (1 + stepUpPercentage / 100);
          }

          // Apply monthly return and subtract current withdrawal amount
          balance = balance * (1 + monthlyRate) - currentWithdrawal;
          
          if (balance <= 0 && depletionMonth === null) {
            // Handle partial withdrawal in final month when fund depletes
            // Can only withdraw what's available after growth
            const actualWithdrawal = balanceStart * (1 + monthlyRate);
            yearWithdrawal += actualWithdrawal;
            totalWithdrawnAmount += actualWithdrawal;
            depletionMonth = (year - 1) * 12 + month;
            balance = 0;
            break;
          } else if (balance > 0) {
            // Normal withdrawal when sufficient balance exists
            yearWithdrawal += currentWithdrawal;
            totalWithdrawnAmount += currentWithdrawal;
          }
        }
      }

      yearlyBreakdown.push({
        year,
        withdrawal: Math.round(yearWithdrawal),
        totalWithdrawn: Math.round(totalWithdrawnAmount),
        balanceStart: Math.round(balanceStart),
        balanceEnd: Math.round(Math.max(0, balance)),
      });

      if (balance <= 0) break;
    }

    const totalWithdrawal = Math.round(totalWithdrawnAmount);
    const remainingBalance = Math.max(0, Math.round(balance));

    return {
      totalWithdrawal,
      remainingBalance,
      initialInvestment: totalInvestment,
      depletionMonth,
      yearlyBreakdown,
    };
  };

  const results = calculateSWPStepUp();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          totalInvestment={totalInvestment}
          setTotalInvestment={setTotalInvestment}
          monthlyWithdrawal={monthlyWithdrawal}
          setMonthlyWithdrawal={setMonthlyWithdrawal}
          stepUpPercentage={stepUpPercentage}
          setStepUpPercentage={setStepUpPercentage}
          expectedReturn={expectedReturn}
          setExpectedReturn={setExpectedReturn}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        <ResultsCard
          totalWithdrawal={results.totalWithdrawal}
          remainingBalance={results.remainingBalance}
          initialInvestment={results.initialInvestment}
          depletionMonth={results.depletionMonth}
          yearlyBreakdown={results.yearlyBreakdown}
        />
      </div>
    </div>
  );
}
