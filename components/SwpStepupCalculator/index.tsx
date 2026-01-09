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
  const centerText = remainingPercentage > 100 
    ? `${(remainingPercentage / 100).toFixed(2)}x Remaining`
    : `${remainingPercentage.toFixed(1)}% Remaining`;

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
          min={100000}
          max={50000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="monthly-withdrawal"
          label="Initial Monthly Withdrawal"
          value={monthlyWithdrawal}
          onChange={setMonthlyWithdrawal}
          min={5000}
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
    let totalWithdrawn = 0;
    let depletionMonth = null;

    for (let i = 0; i < months; i++) {
      // Increase withdrawal at the start of each year
      if (i > 0 && i % 12 === 0) {
        currentWithdrawal = currentWithdrawal * (1 + stepUpPercentage / 100);
      }

      balance = balance * (1 + monthlyRate) - currentWithdrawal;
      totalWithdrawn += currentWithdrawal;

      if (balance <= 0 && depletionMonth === null) {
        depletionMonth = i + 1;
        totalWithdrawn -= currentWithdrawal - (balance + currentWithdrawal);
        balance = 0;
        break;
      }
    }

    const remainingBalance = Math.max(0, balance);

    return {
      totalWithdrawal: Math.round(totalWithdrawn),
      remainingBalance: Math.round(remainingBalance),
      initialInvestment: totalInvestment,
      depletionMonth,
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
        />
      </div>
    </div>
  );
}
