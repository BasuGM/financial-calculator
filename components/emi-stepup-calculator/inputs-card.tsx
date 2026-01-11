import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField } from "@/components/common/input-field";

/**
 * Props for the InputsCard component
 */
interface InputsCardProps {
  loanAmount: number;
  setLoanAmount: (value: number) => void;
  interestRate: number;
  setInterestRate: (value: number) => void;
  loanTenure: number;
  setLoanTenure: (value: number) => void;
  annualStepUp: number;
  setAnnualStepUp: (value: number) => void;
}

/**
 * InputsCard Component
 * Provides input fields for users to enter step-up loan parameters:
 * loan amount, annual interest rate, loan tenure, and annual step-up percentage
 */
export function InputsCard({
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  loanTenure,
  setLoanTenure,
  annualStepUp,
  setAnnualStepUp,
}: InputsCardProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>EMI Step Up Calculator</CardTitle>
        <CardDescription>Calculate loan repayment with annual EMI increase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InputField
          id="loan-amount"
          label="Loan amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={0}
          max={100000000}
          step={100000}
          prefix="₹"
        />

        <InputField
          id="interest-rate"
          label="Interest rate (p.a)"
          value={interestRate}
          onChange={setInterestRate}
          min={0}
          max={30}
          step={0.5}
          suffix="%"
        />

        <InputField
          id="loan-tenure"
          label="Loan tenure"
          value={loanTenure}
          onChange={setLoanTenure}
          min={0}
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
