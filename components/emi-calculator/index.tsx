"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

interface YearlyBreakdown {
  year: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  outstandingBalance: number;
}

interface ResultsCardProps {
  loanAmount: number;
  totalInterest: number;
  totalPayment: number;
  emi: number;
  yearlyBreakdown: YearlyBreakdown[];
}

function ResultsCard({ loanAmount, totalInterest, totalPayment, emi, yearlyBreakdown }: ResultsCardProps) {
  const principalPercentage = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const centerText = `${interestPercentage.toFixed(1)}% Interest`;

  // Prepare data for table dialog
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "emiPaid", label: "EMI Paid", align: "right" as const, minWidth: "110px" },
    { key: "principalPaid", label: "Principal Paid", align: "right" as const, minWidth: "130px" },
    { key: "interestPaid", label: "Interest Paid", align: "right" as const, minWidth: "130px", className: "text-orange-600" },
    { key: "outstandingBalance", label: "Outstanding Balance", align: "right" as const, minWidth: "160px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    emiPaid: row.emiPaid,
    principalPaid: row.principalPaid,
    interestPaid: row.interestPaid,
    outstandingBalance: row.outstandingBalance,
  }));

  const formatCell = (key: string, value: any) => {
    if (key === "year") {
      return value;
    }
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  const highlightRow = (rowIndex: number) => {
    return (rowIndex + 1) % 5 === 0;
  };

  // Prepare data for chart dialog
  const chartData = [
    { year: 0, principalPaid: 0, outstanding: loanAmount },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      principalPaid: loanAmount - row.outstandingBalance,
      outstanding: row.outstandingBalance,
    })),
  ];

  const chartLines = [
    {
      dataKey: "principalPaid",
      name: "Principal Paid",
      color: "#3b82f6",
      gradientId: "colorPrincipalPaid",
    },
    {
      dataKey: "outstanding",
      name: "Outstanding Balance",
      color: "#f59e0b",
      gradientId: "colorOutstanding",
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
            <span>Loan Amount</span>
            <span className="font-semibold text-foreground">
              ₹ {loanAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Interest</span>
            <span className="font-semibold text-orange-600">
              ₹ {totalInterest.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Monthly EMI</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {emi.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            <span>Total Payment</span>
            <span className="font-semibold text-foreground">
              ₹ {totalPayment.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <ProgressBar
          leftPercentage={principalPercentage}
          rightPercentage={interestPercentage}
          centerText={centerText}
          leftLabel="Principal"
          rightLabel="Interest"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your loan repayment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Payment Progress"
            title="Loan Repayment Over Time"
            description="Visual representation of your principal payment and outstanding balance"
            data={chartData}
            lines={chartLines}
            xAxisKey="year"
            xAxisLabel="Years"
            yAxisLabel="Amount"
            formatYAxis={formatCurrency}
            formatTooltip={formatTooltip}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface InputsCardProps {
  loanAmount: number;
  setLoanAmount: (value: number) => void;
  interestRate: number;
  setInterestRate: (value: number) => void;
  loanTenure: number;
  setLoanTenure: (value: number) => void;
}

function InputsCard({
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  loanTenure,
  setLoanTenure,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>EMI Calculator</CardTitle>
        <CardDescription>
          Calculate your Equated Monthly Installment for loans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-12">
        <InputField
          id="loan-amount"
          label="Loan amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={0}
          max={100000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="interest-rate"
          label="Interest rate (p.a)"
          value={interestRate}
          onChange={setInterestRate}
          min={0}
          max={30}
          step={0.5}
          suffix="%"
        />

        <InputField
          id="loan-tenure"
          label="Loan tenure"
          value={loanTenure}
          onChange={setLoanTenure}
          min={0}
          max={40}
          step={1}
          suffix="Yr"
        />
      </CardContent>
    </Card>
  );
}

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    
    // Calculate EMI
    let emi = 0;
    if (monthlyRate === 0) {
      emi = months > 0 ? loanAmount / months : 0;
    } else {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Calculate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let outstandingBalance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= loanTenure; year++) {
      let yearEmiPaid = 0;
      let yearPrincipalPaid = 0;
      let yearInterestPaid = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        if (outstandingBalance > 0) {
          const interestForMonth = outstandingBalance * monthlyRate;
          const principalForMonth = emi - interestForMonth;

          yearEmiPaid += emi;
          yearPrincipalPaid += principalForMonth;
          yearInterestPaid += interestForMonth;
          
          outstandingBalance -= principalForMonth;
          
          if (outstandingBalance < 0) {
            outstandingBalance = 0;
          }
        }
      }

      totalPrincipalPaid += yearPrincipalPaid;
      totalInterestPaid += yearInterestPaid;

      yearlyBreakdown.push({
        year,
        emiPaid: Math.round(yearEmiPaid),
        principalPaid: Math.round(yearPrincipalPaid),
        interestPaid: Math.round(yearInterestPaid),
        outstandingBalance: Math.round(Math.max(0, outstandingBalance)),
      });
    }

    const totalPayment = emi * months;
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
