"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, YearlyBreakdown } from "./results-card";

/**
 * Main SWP (Systematic Withdrawal Plan) Calculator component that manages state
 * and coordinates between input controls and results display with year-by-year breakdown.
 * Tracks fund depletion and partial withdrawals when balance runs out.
 */
export default function SwpCalculator() {
  // Default values: ₹50,00,000 initial investment, ₹50,000 monthly withdrawal, 10% return, 10 years
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [timePeriod, setTimePeriod] = useState(10);

  /**
   * Calculate SWP (Systematic Withdrawal Plan) by simulating monthly withdrawals
   * with compound interest on remaining balance.
   * Tracks fund depletion and handles partial final withdrawal.
   */
  const calculateSWP = () => {
    // Convert annual rate to monthly rate
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let depletionMonth = null; // Track when fund runs out
    let totalWithdrawnAmount = 0;

    // Generate year-by-year breakdown for table and chart visualization
    const yearlyBreakdown: YearlyBreakdown[] = [];

    for (let year = 1; year <= timePeriod; year++) {
      const balanceStart = balance;
      let yearWithdrawal = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        if (balance > 0) {
          // Apply monthly return and subtract withdrawal
          balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
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
            yearWithdrawal += monthlyWithdrawal;
            totalWithdrawnAmount += monthlyWithdrawal;
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

  const results = calculateSWP();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          totalInvestment={totalInvestment}
          setTotalInvestment={setTotalInvestment}
          monthlyWithdrawal={monthlyWithdrawal}
          setMonthlyWithdrawal={setMonthlyWithdrawal}
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
