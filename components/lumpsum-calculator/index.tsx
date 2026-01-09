"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

interface YearlyBreakdown {
  year: number;
  yearStartValue: number;
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
    { key: "yearStartValue", label: "Year Start Value", align: "right" as const, minWidth: "140px", className: "text-muted-foreground" },
    { key: "interestEarned", label: "Interest Earned", align: "right" as const, minWidth: "140px", className: "text-green-600" },
    { key: "yearEndValue", label: "Year End Value", align: "right" as const, minWidth: "140px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    yearStartValue: row.yearStartValue,
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
    { year: 0, invested: totalInvestment, futureValue: totalInvestment },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      invested: totalInvestment,
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
            description="Detailed annual progression of your lumpsum investment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Growth Chart"
            title="Investment Growth Over Time"
            description="Visual representation of your lumpsum investment growth and compounding effect"
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
  totalInvestment: number;
  setTotalInvestment: (value: number) => void;
  expectedReturn: number;
  setExpectedReturn: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
}

function InputsCard({
  totalInvestment,
  setTotalInvestment,
  expectedReturn,
  setExpectedReturn,
  timePeriod,
  setTimePeriod,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Lumpsum Calculator</CardTitle>
        <CardDescription>
          Calculate returns on your one-time investment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-12">
        <InputField
          id="total-investment"
          label="Total investment"
          value={totalInvestment}
          onChange={setTotalInvestment}
          min={0}
          max={100000000}
          step={10000}
          prefix="₹"
        />

        <InputField
          id="expected-return"
          label="Expected return rate (p.a)"
          value={expectedReturn}
          onChange={setExpectedReturn}
          min={0}
          max={30}
          step={0.5}
          suffix="%"
        />

        <InputField
          id="time-period"
          label="Time period"
          value={timePeriod}
          onChange={setTimePeriod}
          min={0}
          max={40}
          step={1}
          suffix="Yr"
        />
      </CardContent>
    </Card>
  );
}

export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateLumpsum = () => {
    const annualRate = expectedReturn / 100;
    
    // Calculate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    let currentValue = totalInvestment;

    for (let year = 1; year <= timePeriod; year++) {
      const yearStartValue = currentValue;
      const interestEarned = currentValue * annualRate;
      const yearEndValue = currentValue * (1 + annualRate);
      
      yearlyBreakdown.push({
        year,
        yearStartValue: Math.round(yearStartValue),
        interestEarned: Math.round(interestEarned),
        yearEndValue: Math.round(yearEndValue),
      });
      
      currentValue = yearEndValue;
    }

    const futureValue = totalInvestment * Math.pow(1 + annualRate, timePeriod);
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
