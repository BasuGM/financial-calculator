"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

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

/**
 * InputsCard component provides input fields for SWP Step Up calculation parameters:
 * initial investment, initial monthly withdrawal, annual step-up percentage, return rate, and time period.
 */
export function InputsCard({
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
