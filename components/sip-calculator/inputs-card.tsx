"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

interface InputsCardProps {
  monthlyInvestment: number;
  setMonthlyInvestment: (value: number) => void;
  expectedReturn: number;
  setExpectedReturn: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
}

/**
 * InputsCard component provides input fields for SIP calculation parameters:
 * monthly investment amount, expected annual return rate, and investment time period.
 */
export function InputsCard({
  monthlyInvestment,
  setMonthlyInvestment,
  expectedReturn,
  setExpectedReturn,
  timePeriod,
  setTimePeriod,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>SIP Calculator</CardTitle>
        <CardDescription>
          Calculate returns on your Systematic Investment Plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-12">
        <InputField
          id="monthly-investment"
          label="Monthly investment"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          min={0}
          max={100000}
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
      </CardContent>
    </Card>
  );
}
