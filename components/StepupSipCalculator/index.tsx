"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";
import { ProgressBar } from "@/components/common/progress-bar";

interface ResultsCardProps {
  totalInvestment: number;
  estimatedReturns: number;
  futureValue: number;
}

function ResultsCard({ totalInvestment, estimatedReturns, futureValue }: ResultsCardProps) {
  const investmentPercentage = futureValue > 0 ? (totalInvestment / futureValue) * 100 : 0;
  const returnsPercentage = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;
  const centerText = `${returnsPercentage.toFixed(1)}% Returns`;

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

    for (let month = 1; month <= months; month++) {
      // Increase investment at the start of each year (except first year)
      if (month > 1 && (month - 1) % 12 === 0) {
        currentMonthlyInvestment = currentMonthlyInvestment * (1 + annualStepUp / 100);
      }

      totalInvestment += currentMonthlyInvestment;
      futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
    }

    const estimatedReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
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
        />
      </div>
    </div>
  );
}
