"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

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

/**
 * InputsCard component provides input fields for SWP calculation parameters:
 * initial investment, monthly withdrawal amount, expected return rate, and time period.
 */
export function InputsCard({
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
          min={0}
          max={50000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="monthly-withdrawal"
          label="Monthly Withdrawal"
          value={monthlyWithdrawal}
          onChange={setMonthlyWithdrawal}
          min={0}
          max={500000}
          step={1000}
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
