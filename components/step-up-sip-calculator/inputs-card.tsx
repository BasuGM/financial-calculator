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
  annualStepUp: number;
  setAnnualStepUp: (value: number) => void;
}

/**
 * InputsCard component provides input fields for Step Up SIP calculation parameters:
 * initial monthly investment, expected return rate, time period, and annual step-up percentage.
 */
export function InputsCard({
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
