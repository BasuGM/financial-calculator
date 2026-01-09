"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";
import { Info } from "lucide-react";

interface YearlyBreakdown {
  year: number;
  withdrawal: number;
  totalWithdrawn: number;
  balanceStart: number;
  balanceEnd: number;
}

interface ResultsCardProps {
  totalWithdrawal: number;
  remainingBalance: number;
  initialInvestment: number;
  depletionMonth: number | null;
  yearlyBreakdown: YearlyBreakdown[];
}

function ResultsCard({
  totalWithdrawal,
  remainingBalance,
  initialInvestment,
  depletionMonth,
  yearlyBreakdown,
}: ResultsCardProps) {
  const withdrawalPercentage = initialInvestment > 0 ? (totalWithdrawal / initialInvestment) * 100 : 0;
  const remainingPercentage = initialInvestment > 0 ? (remainingBalance / initialInvestment) * 100 : 0;
  const centerText = remainingPercentage > 100 
    ? `${(remainingPercentage / 100).toFixed(2)}x Remaining`
    : `${remainingPercentage.toFixed(1)}% Remaining`;

  // Prepare data for table dialog
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "withdrawal", label: "Withdrawn", align: "right" as const, minWidth: "120px" },
    { key: "totalWithdrawn", label: "Total Withdrawn", align: "right" as const, minWidth: "140px" },
    { key: "balanceStart", label: "Balance Start", align: "right" as const, minWidth: "130px", className: "text-muted-foreground" },
    { key: "balanceEnd", label: "Balance End", align: "right" as const, minWidth: "130px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    withdrawal: row.withdrawal,
    totalWithdrawn: row.totalWithdrawn,
    balanceStart: row.balanceStart,
    balanceEnd: row.balanceEnd,
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
    { year: 0, withdrawn: 0, balance: initialInvestment },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      withdrawn: row.totalWithdrawn,
      balance: row.balanceEnd,
    })),
  ];

  const chartLines = [
    {
      dataKey: "withdrawn",
      name: "Total Withdrawn",
      color: "#3b82f6",
      gradientId: "colorWithdrawn",
    },
    {
      dataKey: "balance",
      name: "Remaining Balance",
      color: "#22c55e",
      gradientId: "colorBalance",
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
            <span>Initial Investment</span>
            <span className="font-semibold text-foreground">
              ₹ {initialInvestment.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Withdrawal</span>
            <span className="font-semibold text-blue-600">
              ₹ {totalWithdrawal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Remaining Balance</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {remainingBalance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          leftPercentage={remainingPercentage}
          rightPercentage={withdrawalPercentage}
          centerText={centerText}
          leftLabel="Remaining"
          rightLabel="Withdrawn"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your SWP step-up withdrawals"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Withdrawal Progress"
            title="Withdrawal Progress Over Time"
            description="Visual representation of your portfolio depletion with step-up withdrawals"
            data={chartData}
            lines={chartLines}
            xAxisKey="year"
            xAxisLabel="Years"
            yAxisLabel="Amount"
            formatYAxis={formatCurrency}
            formatTooltip={formatTooltip}
          />
        </div>

        {depletionMonth && (
          <Alert className="rounded-none">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Fund depleted after {Math.floor(depletionMonth / 12)} years{" "}
              {depletionMonth % 12} months
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

interface InputsCardProps {
  totalInvestment: number;
  setTotalInvestment: (value: number) => void;
  monthlyWithdrawal: number;
  setMonthlyWithdrawal: (value: number) => void;
  stepUpPercentage: number;
  setStepUpPercentage: (value: number) => void;
  expectedReturn: number;
  setExpectedReturn: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
}

function InputsCard({
  totalInvestment,
  setTotalInvestment,
  monthlyWithdrawal,
  setMonthlyWithdrawal,
  stepUpPercentage,
  setStepUpPercentage,
  expectedReturn,
  setExpectedReturn,
  timePeriod,
  setTimePeriod,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>SWP Step Up Calculator</CardTitle>
        <CardDescription>Calculate withdrawals with step-up increments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputField
          id="total-investment"
          label="Total Investment"
          value={totalInvestment}
          onChange={setTotalInvestment}
          min={0}
          max={50000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="monthly-withdrawal"
          label="Initial Monthly Withdrawal"
          value={monthlyWithdrawal}
          onChange={setMonthlyWithdrawal}
          min={0}
          max={500000}
          step={1000}
          prefix="₹"
        />

        <InputField
          id="step-up-percentage"
          label="Annual Step Up"
          value={stepUpPercentage}
          onChange={setStepUpPercentage}
          min={0}
          max={20}
          step={1}
          suffix="%"
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

export default function SwpStepupCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(40000);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSWPStepUp = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let currentWithdrawal = monthlyWithdrawal;
    let totalWithdrawnAmount = 0;
    let depletionMonth = null;

    // Calculate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];

    for (let year = 1; year <= timePeriod; year++) {
      const balanceStart = balance;
      let yearWithdrawal = 0;

      // Process 12 months for this year
      for (let month = 1; month <= 12; month++) {
        if (balance > 0) {
          // Increase withdrawal at the start of each year (except first year, first month)
          if (year > 1 && month === 1) {
            currentWithdrawal = currentWithdrawal * (1 + stepUpPercentage / 100);
          }

          balance = balance * (1 + monthlyRate) - currentWithdrawal;
          
          if (balance <= 0 && depletionMonth === null) {
            // Partial withdrawal in final month
            const actualWithdrawal = balanceStart * (1 + monthlyRate);
            yearWithdrawal += actualWithdrawal;
            totalWithdrawnAmount += actualWithdrawal;
            depletionMonth = (year - 1) * 12 + month;
            balance = 0;
            break;
          } else if (balance > 0) {
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
