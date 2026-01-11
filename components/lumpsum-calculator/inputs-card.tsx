import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

/**
 * Props for the InputsCard component
 */
interface InputsCardProps {
  totalInvestment: number;
  setTotalInvestment: (value: number) => void;
  expectedReturn: number;
  setExpectedReturn: (value: number) => void;
  timePeriod: number;
  setTimePeriod: (value: number) => void;
}

/**
 * InputsCard Component
 * Provides input fields for users to enter lumpsum investment parameters:
 * total investment amount, expected annual return rate, and investment time period
 */
export function InputsCard({
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
