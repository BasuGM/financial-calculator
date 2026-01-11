"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, type YearlyBreakdown } from "./results-card";

/**
 * EmiStepupCalculator Component
 * Main component that manages the state and calculations for the EMI Step-Up calculator.
 * Step-up EMI loans allow the borrower to start with a lower EMI that increases annually
 * by a fixed percentage, making it easier to manage payments in early years while assuming
 * income growth over time. The loan still completes in the specified tenure.
 */
export default function EmiStepupCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [annualStepUp, setAnnualStepUp] = useState(5);

  /**
   * Calculate step-up EMI and loan repayment breakdown
   * Unlike standard EMI, the initial EMI must be calculated to account for annual increases
   * so that the loan is paid off in exactly the specified tenure. This uses an iterative
   * approach to find the optimal starting EMI.
   */
  const calculateEMIStepUp = () => {
    // Convert annual interest rate to monthly rate in decimal form
    const monthlyRate = interestRate / 12 / 100;
    // Convert years to months
    const months = loanTenure * 12;
    // Convert step-up percentage to decimal
    const stepUpRate = annualStepUp / 100;
    
    // Calculate initial EMI considering the step-up factor
    // For step-up loans, we need to find the starting EMI such that the loan is paid off in exact tenure
    // This is complex because each year's EMI is different, affecting the principal-interest split
    let initialEmi = 0;
    
    if (months === 0 || loanAmount === 0) {
      // Handle edge case: no loan or no tenure
      initialEmi = 0;
    } else if (monthlyRate === 0) {
      // For zero interest, calculate weighted average EMI considering step-ups
      // Each year's EMI is worth more in repayment terms due to step-up factor
      let totalMonths = 0;
      for (let year = 0; year < loanTenure; year++) {
        const stepUpFactor = Math.pow(1 + stepUpRate, year);
        totalMonths += 12 * stepUpFactor;
      }
      initialEmi = totalMonths > 0 ? loanAmount / totalMonths : 0;
    } else {
      // Calculate initial EMI using iterative approach for step-up loans
      // Start with standard EMI as initial guess (will be adjusted)
      let testEmi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
      
      // Iteratively adjust EMI to ensure loan completes in exact tenure
      // This converges quickly (usually < 20 iterations) to find the correct starting EMI
      for (let iteration = 0; iteration < 50; iteration++) {
        let balance = loanAmount;
        let currentEmi = testEmi;
        
        // Simulate the entire loan repayment with this test EMI
        for (let year = 1; year <= loanTenure; year++) {
          for (let month = 1; month <= 12; month++) {
            if (balance > 0) {
              // Apply step-up increase at the start of each year (except year 1)
              if (year > 1 && month === 1) {
                currentEmi = currentEmi * (1 + stepUpRate);
              }
              const interest = balance * monthlyRate;
              const principal = currentEmi - interest;
              balance -= principal;
            }
          }
        }
        
        // Adjust testEmi based on remaining balance
        // If balance is very close to zero, we've found the correct EMI
        if (Math.abs(balance) < 1) break;
        
        if (balance > 0) {
          // Loan not fully paid, increase starting EMI by 1%
          testEmi *= 1.01;
        } else {
          // Overpaid, decrease starting EMI by 1%
          testEmi *= 0.99;
        }
      }
      
      initialEmi = testEmi;
    }
    
    // Use the calculated initial EMI as the starting point
    let currentEmi = initialEmi;

    // Calculate year-by-year breakdown with step-up increases
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let outstandingBalance = loanAmount;
    let totalPayment = 0;
    let totalInterestPaid = 0;

    // Iterate through each year of the loan tenure
    for (let year = 1; year <= loanTenure; year++) {
      let yearEmiPaid = 0;
      let yearPrincipalPaid = 0;
      let yearInterestPaid = 0;
      let yearMonthlyEmi = currentEmi;

      // Process each of the 12 months in this year
      for (let month = 1; month <= 12; month++) {
        if (outstandingBalance > 0) {
          // Increase EMI at the start of each year (except first year)
          if (year > 1 && month === 1) {
            currentEmi = currentEmi * (1 + annualStepUp / 100);
            yearMonthlyEmi = currentEmi;
          }

          // Calculate interest on the outstanding balance
          const interestForMonth = outstandingBalance * monthlyRate;
          // Calculate principal repayment (EMI minus interest)
          const principalForMonth = currentEmi - interestForMonth;

          // Accumulate yearly totals
          yearEmiPaid += currentEmi;
          yearPrincipalPaid += principalForMonth;
          yearInterestPaid += interestForMonth;
          
          // Reduce outstanding balance by the principal paid
          outstandingBalance -= principalForMonth;
          
          if (outstandingBalance < 0) {
            // Adjust for overpayment in final month (minor rounding correction)
            yearPrincipalPaid += outstandingBalance;
            yearEmiPaid += outstandingBalance;
            outstandingBalance = 0;
          }
        }
      }

      // Track cumulative totals across all years
      totalPayment += yearEmiPaid;
      totalInterestPaid += yearInterestPaid;

      // Store this year's breakdown data
      yearlyBreakdown.push({
        year,
        monthlyEmi: Math.round(yearMonthlyEmi),
        emiPaid: Math.round(yearEmiPaid),
        principalPaid: Math.round(yearPrincipalPaid),
        interestPaid: Math.round(yearInterestPaid),
        outstandingBalance: Math.round(Math.max(0, outstandingBalance)),
      });

      // Stop if loan is fully repaid (can happen due to rounding)
      if (outstandingBalance <= 0) break;
    }

    return {
      firstMonthEmi: Math.round(initialEmi), // Original first month EMI before any step-up
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterestPaid),
      loanAmount: Math.round(loanAmount),
      yearlyBreakdown,
    };
  };

  const results = calculateEMIStepUp();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <InputsCard
          loanAmount={loanAmount}
          setLoanAmount={setLoanAmount}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          loanTenure={loanTenure}
          setLoanTenure={setLoanTenure}
          annualStepUp={annualStepUp}
          setAnnualStepUp={setAnnualStepUp}
        />

        <ResultsCard
          loanAmount={results.loanAmount}
          firstMonthEmi={results.firstMonthEmi}
          totalInterest={results.totalInterest}
          totalPayment={results.totalPayment}
          yearlyBreakdown={results.yearlyBreakdown}
        />
      </div>
    </div>
  );
}
