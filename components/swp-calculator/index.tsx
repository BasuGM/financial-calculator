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
import { Info } from "lucide-react";

interface ResultsCardProps {
  totalWithdrawal: number;
  remainingBalance: number;
  initialInvestment: number;
  depletionMonth: number | null;
}

function ResultsCard({
  totalWithdrawal,
  remainingBalance,
  initialInvestment,
  depletionMonth,
}: ResultsCardProps) {
  const withdrawalPercentage = (totalWithdrawal / initialInvestment) * 100;
  const remainingPercentage = (remainingBalance / initialInvestment) * 100;
  const centerText = `${remainingPercentage.toFixed(1)}% Remaining`;

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
  expectedReturn,
  setExpectedReturn,
  timePeriod,
  setTimePeriod,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>SWP Calculator</CardTitle>
        <CardDescription>Plan your Systematic Withdrawal Plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          id="total-investment"
          label="Total Investment"
          value={totalInvestment}
          onChange={setTotalInvestment}
          min={100000}
          max={50000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="monthly-withdrawal"
          label="Monthly Withdrawal"
          value={monthlyWithdrawal}
          onChange={setMonthlyWithdrawal}
          min={5000}
          max={500000}
          step={1000}
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
      </CardContent>
    </Card>
  );
}

export default function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSWP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let balance = totalInvestment;
    let depletionMonth = null;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      if (balance <= 0 && depletionMonth === null) {
        depletionMonth = i + 1;
        balance = 0;
        break;
      }
    }

    const totalWithdrawal = Math.min(
      monthlyWithdrawal * months,
      totalInvestment +
        (balance > 0 ? totalInvestment * monthlyRate * months : 0)
    );
    const remainingBalance = Math.max(0, balance);

    return {
      totalWithdrawal: Math.round(totalWithdrawal),
      remainingBalance: Math.round(remainingBalance),
      initialInvestment: totalInvestment,
      depletionMonth,
    };
  };

  const results = calculateSWP();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
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
        />
      </div>
    </div>
  );
}
