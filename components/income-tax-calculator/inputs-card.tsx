import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

/**
 * Props for the InputsCard component
 */
interface InputsCardProps {
  grossIncome: number;
  setGrossIncome: (value: number) => void;
  deduction80C: number;
  setDeduction80C: (value: number) => void;
  deduction80D: number;
  setDeduction80D: (value: number) => void;
  otherDeductions: number;
  setOtherDeductions: (value: number) => void;
}

/**
 * InputsCard Component
 * Provides input fields for users to enter income and deduction details:
 * gross annual income, Section 80C deductions (investments/insurance up to ₹1.5L),
 * Section 80D deductions (health insurance), and other eligible deductions
 */
export function InputsCard({
  grossIncome,
  setGrossIncome,
  deduction80C,
  setDeduction80C,
  deduction80D,
  setDeduction80D,
  otherDeductions,
  setOtherDeductions,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Income Tax Calculator</CardTitle>
        <CardDescription>
          Calculate your income tax liability (New Tax Regime FY 2025-26)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          id="gross-income"
          label="Gross annual income"
          value={grossIncome}
          onChange={setGrossIncome}
          min={0}
          max={100000000}
          step={10000}
          prefix="₹"
        />

        <InputField
          id="deduction-80c"
          label="Deduction under 80C"
          value={deduction80C}
          onChange={setDeduction80C}
          min={0}
          max={150000}
          step={10000}
          prefix="₹"
        />

        <InputField
          id="deduction-80d"
          label="Deduction under 80D"
          value={deduction80D}
          onChange={setDeduction80D}
          min={0}
          max={100000}
          step={5000}
          prefix="₹"
        />

        <InputField
          id="other-deductions"
          label="Other deductions"
          value={otherDeductions}
          onChange={setOtherDeductions}
          min={0}
          max={500000}
          step={10000}
          prefix="₹"
        />
      </CardContent>
    </Card>
  );
}
