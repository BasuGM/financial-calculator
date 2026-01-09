"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

interface YearlyBreakdown {
  year: number;
  investment: number;
  totalInvested: number;
  interestEarned: number;
  yearEndValue: number;
}

interface ResultsCardProps {
  totalInvestment: number;
  estimatedReturns: number;
  futureValue: number;
  yearlyBreakdown: YearlyBreakdown[];
}

function ResultsCard({ totalInvestment, estimatedReturns, futureValue, yearlyBreakdown }: ResultsCardProps) {
  const investmentPercentage = futureValue > 0 ? (totalInvestment / futureValue) * 100 : 0;
  const returnsPercentage = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;
  const centerText = `${returnsPercentage.toFixed(1)}% Returns`;

  // Prepare data for table dialog
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "investment", label: "Invested", align: "right" as const, minWidth: "110px" },
    { key: "totalInvested", label: "Total Invested", align: "right" as const, minWidth: "130px" },
    { key: "interestEarned", label: "Interest Earned", align: "right" as const, minWidth: "140px", className: "text-green-600" },
    { key: "yearEndValue", label: "Year End Value", align: "right" as const, minWidth: "140px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    investment: row.investment,
    totalInvested: row.totalInvested,
    interestEarned: row.interestEarned,
    yearEndValue: row.yearEndValue,
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
    { year: 0, invested: 0, futureValue: 0 },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      invested: row.totalInvested,
      futureValue: row.yearEndValue,
    })),
  ];

  const chartLines = [
    {
      dataKey: "invested",
      name: "Total Invested",
      color: "#3b82f6",
      gradientId: "colorInvested",
    },
    {
      dataKey: "futureValue",
      name: "Future Value",
      color: "#22c55e",
      gradientId: "colorFutureValue",
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
            <span>Total Investment</span>
            <span className="font-semibold text-foreground">
              ₹ {totalInvestment.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Estimated Returns</span>
            <span className="font-semibold text-green-600">
              ₹ {estimatedReturns.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Future Value</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {futureValue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          leftPercentage={investmentPercentage}
          rightPercentage={returnsPercentage}
          centerText={centerText}
          leftLabel="Investment"
          rightLabel="Returns"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your Step Up SIP investment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Growth Chart"
            title="Investment Growth Over Time"
            description="Visual representation of your portfolio growth with step-up increments"
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
  monthlyInvestment: number;
  setMonthlyInvestment: (value: number) => void;
  expectedReturn: number;
  setExpectedReturn: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
  annualStepUp: number;
  setAnnualStepUp: (value: number) => void;
}

function InputsCard({
  monthlyInvestment,
  setMonthlyInvestment,
  expectedReturn,
  setExpectedReturn,
  timePeriod,
  setTimePeriod,
  annualStepUp,
  setAnnualStepUp,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Step Up SIP Calculator</CardTitle>
        <CardDescription>Calculate returns with annual increase in investment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          id="monthly-investment"
          label="Monthly investment"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          min={0}
          max={1000000}
          step={500}
          prefix="₹"
        />

        <InputField
          id="expected-return"
          label="Expected return rate (p.a)"
          value={expectedReturn}
          onChange={setExpectedReturn}
          min={1}
          max={30}
          step={0.5}
          suffix="%"
        />

        <InputField
          id="time-period"
          label="Time period"
          value={timePeriod}
          onChange={setTimePeriod}
          min={1}
          max={40}
          step={1}
          suffix="Yr"
        />

        <InputField
          id="annual-stepup"
          label="Annual step up"
          value={annualStepUp}
          onChange={setAnnualStepUp}
          min={0}
          max={50}
          step={1}
          suffix="%"
        />
      </CardContent>
    </Card>
  );
}

export default function StepupSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [annualStepUp, setAnnualStepUp] = useState(10);

  const calculateStepUpSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let totalInvestment = 0;
    let futureValue = 0;
    let currentMonthlyInvestment = monthlyInvestment;

    // Calculate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let runningBalance = 0;
    let runningInvestment = 0;

    for (let year = 1; year <= timePeriod; year++) {
      let yearInvestment = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        // Increase investment at the start of each year (except first year)
        if (year > 1 && month === 1) {
          currentMonthlyInvestment = currentMonthlyInvestment * (1 + annualStepUp / 100);
        }

        totalInvestment += currentMonthlyInvestment;
        yearInvestment += currentMonthlyInvestment;
        futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
      }

      runningInvestment += yearInvestment;
      runningBalance = futureValue;
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
