"use client";

import { useState } from "react";
import { InputsCard } from "./inputs-card";
import { ResultsCard, type YearlyBreakdown } from "./results-card";

/**
 * EmiCalculator Component
 * Main component that manages the state and calculations for the EMI (Equated Monthly Installment) calculator.
 * EMI is the fixed monthly payment amount made by a borrower to a lender at a specified date each month.
 * The EMI is calculated using the loan amount, interest rate, and loan tenure.
 */
export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  /**
   * Calculate EMI and loan repayment breakdown
   * Uses the standard EMI formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
   * where P = Principal loan amount, r = monthly interest rate, n = number of months
   */
  const calculateEMI = () => {
    // Convert annual interest rate to monthly rate in decimal form
    const monthlyRate = interestRate / 12 / 100;
    // Convert years to months
    const months = loanTenure * 12;
    
    // Calculate EMI using the standard EMI formula
    let emi = 0;
    if (months === 0 || loanAmount === 0) {
      // Handle edge case: no loan or no tenure
      emi = 0;
    } else if (monthlyRate === 0) {
      // Handle zero interest rate: simple division
      emi = loanAmount / months;
    } else {
      // Standard EMI formula for loans with interest
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Calculate year-by-year breakdown to show repayment progression
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let outstandingBalance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    // Iterate through each year of the loan tenure
    for (let year = 1; year <= loanTenure; year++) {
      let yearEmiPaid = 0;
      let yearPrincipalPaid = 0;
      let yearInterestPaid = 0;

      // Process each of the 12 months in this year
      for (let month = 1; month <= 12; month++) {
        if (outstandingBalance > 0) {
          // Calculate interest on the outstanding balance
          const interestForMonth = outstandingBalance * monthlyRate;
          // Calculate principal repayment (EMI minus interest)
          const principalForMonth = emi - interestForMonth;

          // Accumulate yearly totals
          yearEmiPaid += emi;
          yearPrincipalPaid += principalForMonth;
          yearInterestPaid += interestForMonth;
          
          // Reduce outstanding balance by the principal paid
          outstandingBalance -= principalForMonth;
          
          // Ensure balance doesn't go negative
          if (outstandingBalance < 0) {
            outstandingBalance = 0;
          }
        }
      }

      // Track cumulative totals
      totalPrincipalPaid += yearPrincipalPaid;
      totalInterestPaid += yearInterestPaid;

      // Store this year's breakdown data
      yearlyBreakdown.push({
        year,
        emiPaid: Math.round(yearEmiPaid),
        principalPaid: Math.round(yearPrincipalPaid),
        interestPaid: Math.round(yearInterestPaid),
        outstandingBalance: Math.round(Math.max(0, outstandingBalance)),
      });
    }

    // Calculate total payment over the entire loan period
    const totalPayment = emi * months;
    // Calculate total interest paid (total payment minus original loan amount)
    const totalInterest = totalPayment - loanAmount;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      loanAmount: Math.round(loanAmount),
      yearlyBreakdown,
    };
  };

  const results = calculateEMI();

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
        />

        <ResultsCard
          loanAmount={results.loanAmount}
          totalInterest={results.totalInterest}
          totalPayment={results.totalPayment}
          emi={results.emi}
          yearlyBreakdown={results.yearlyBreakdown}
        />
      </div>
    </div>
  );
}
