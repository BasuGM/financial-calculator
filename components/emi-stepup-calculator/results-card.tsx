import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

/**
 * Represents the breakdown of EMI step-up loan repayment for a single year
 * Monthly EMI increases each year by the step-up percentage
 */
export interface YearlyBreakdown {
  year: number;
  monthlyEmi: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  outstandingBalance: number;
}

/**
 * Props for the ResultsCard component
 */
interface ResultsCardProps {
  loanAmount: number;
  firstMonthEmi: number;
  totalInterest: number;
  totalPayment: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * ResultsCard Component
 * Displays the calculated results of the EMI step-up loan including first month EMI,
 * total interest, total payment, and visualizations showing how EMI increases each year
 */
export function ResultsCard({ loanAmount, firstMonthEmi, totalInterest, totalPayment, yearlyBreakdown }: ResultsCardProps) {
  // Calculate what percentage of the total payment is the principal (loan amount)
  const principalPercentage = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  // Calculate what percentage of the total payment is interest
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  // Display the interest percentage in the center of the progress bar
  const centerText = `${interestPercentage.toFixed(1)}% Interest`;

  // Prepare data for table dialog - includes monthly EMI column to show step-up increments
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "monthlyEmi", label: "Monthly EMI", align: "right" as const, minWidth: "120px", className: "text-blue-600" },
    { key: "emiPaid", label: "EMI Paid", align: "right" as const, minWidth: "110px" },
    { key: "principalPaid", label: "Principal Paid", align: "right" as const, minWidth: "130px" },
    { key: "interestPaid", label: "Interest Paid", align: "right" as const, minWidth: "130px", className: "text-orange-600" },
    { key: "outstandingBalance", label: "Outstanding Balance", align: "right" as const, minWidth: "160px", className: "font-semibold" },
  ];

  // Transform yearly breakdown data for table display
  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    monthlyEmi: row.monthlyEmi,
    emiPaid: row.emiPaid,
    principalPaid: row.principalPaid,
    interestPaid: row.interestPaid,
    outstandingBalance: row.outstandingBalance,
  }));

  // Format table cells - display year as number, all other values as currency
  const formatCell = (key: string, value: any) => {
    if (key === "year") {
      return value;
    }
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  // Highlight every 5th row in the table for better readability
  const highlightRow = (rowIndex: number) => {
    return (rowIndex + 1) % 5 === 0;
  };

  // Prepare data for chart dialog - track principal paid and outstanding balance over time
  const chartData = [
    { year: 0, principalPaid: 0, outstanding: loanAmount },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      principalPaid: loanAmount - row.outstandingBalance,
      outstanding: row.outstandingBalance,
    })),
  ];

  // Define chart lines configuration for principal paid and outstanding balance
  const chartLines = [
    {
      dataKey: "principalPaid",
      name: "Principal Paid",
      color: "#3b82f6",
      gradientId: "colorPrincipalPaid",
    },
    {
      dataKey: "outstanding",
      name: "Outstanding Balance",
      color: "#f59e0b",
      gradientId: "colorOutstanding",
    },
  ];

  // Format currency for Y-axis labels: Cr for crores, L for lakhs, K for thousands
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  // Format tooltip to display full amount with Indian number formatting
  const formatTooltip = (value: number | undefined) =>
    value !== undefined ? `₹${value.toLocaleString("en-IN")}` : "";

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Loan Amount</span>
            <span className="font-semibold text-foreground">
              ₹ {loanAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Interest</span>
            <span className="font-semibold text-orange-600">
              ₹ {totalInterest.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">First Month EMI</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {firstMonthEmi.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            <span>Total Payment</span>
            <span className="font-semibold text-foreground">
              ₹ {totalPayment.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <ProgressBar
          leftPercentage={principalPercentage}
          rightPercentage={interestPercentage}
          centerText={centerText}
          leftLabel="Principal"
          rightLabel="Interest"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your EMI step-up loan repayment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Payment Progress"
            title="Loan Repayment Over Time"
            description="Visual representation of your principal payment with step-up EMI increments"
            data={chartData}
            lines={chartLines}
            xAxisKey="year"
            xAxisLabel="Years"
            yAxisLabel="Amount"
            formatYAxis={formatCurrency}
            formatTooltip={formatTooltip}
          />
        </div>
      </CardContent>
    </Card>
  );
}
