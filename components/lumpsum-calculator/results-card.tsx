import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

/**
 * Represents the breakdown of lumpsum investment for a single year
 */
export interface YearlyBreakdown {
  year: number;
  yearStartValue: number;
  interestEarned: number;
  yearEndValue: number;
}

/**
 * Props for the ResultsCard component
 */
interface ResultsCardProps {
  totalInvestment: number;
  estimatedReturns: number;
  futureValue: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * ResultsCard Component
 * Displays the calculated results of the lumpsum investment including total investment,
 * estimated returns, future value, and visualizations through progress bar, table, and chart
 */
export function ResultsCard({ totalInvestment, estimatedReturns, futureValue, yearlyBreakdown }: ResultsCardProps) {
  // Calculate what percentage of the future value comes from the original investment
  const investmentPercentage = futureValue > 0 ? (totalInvestment / futureValue) * 100 : 0;
  // Calculate what percentage of the future value comes from returns
  const returnsPercentage = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;
  
  // Calculate return ratio to determine if gains are more or less than 100%
  // If < 1 (less than 100%), show as percentage; otherwise show as multiplier (e.g., 2.5x)
  const returnRatio = totalInvestment > 0 ? (futureValue - totalInvestment) / totalInvestment : 0;
  // Display logic: percentage for returns under 100%, multiplier for returns 100% and above
  const centerText = returnRatio < 1 
    ? `${(returnRatio * 100).toFixed(1)}% Returns`
    : `${(returnRatio).toFixed(2)}x Returns`;

  // Prepare data for table dialog - define column configuration
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "yearStartValue", label: "Year Start Value", align: "right" as const, minWidth: "140px", className: "text-muted-foreground" },
    { key: "interestEarned", label: "Interest Earned", align: "right" as const, minWidth: "140px", className: "text-green-600" },
    { key: "yearEndValue", label: "Year End Value", align: "right" as const, minWidth: "140px", className: "font-semibold" },
  ];

  // Transform yearly breakdown data for table display
  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    yearStartValue: row.yearStartValue,
    interestEarned: row.interestEarned,
    yearEndValue: row.yearEndValue,
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

  // Prepare data for chart dialog - include year 0 as starting point
  const chartData = [
    { year: 0, invested: totalInvestment, futureValue: totalInvestment },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      invested: totalInvestment,
      futureValue: row.yearEndValue,
    })),
  ];

  // Define chart lines configuration for invested amount and future value
  const chartLines = [
    {
      dataKey: "invested",
      name: "Total Invested",
      color: "#3b82f6",
      gradientId: "colorInvested",
    },
    {
      dataKey: "futureValue",
      name: "Future Value",
      color: "#22c55e",
      gradientId: "colorFutureValue",
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

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your lumpsum investment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Growth Chart"
            title="Investment Growth Over Time"
            description="Visual representation of your lumpsum investment growth and compounding effect"
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
