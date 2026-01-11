"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

export interface YearlyBreakdown {
  year: number;
  investment: number;
  totalInvested: number;
  interestEarned: number;
  yearEndValue: number;
}

interface ResultsCardProps {
  totalInvestment: number;
  estimatedReturns: number;
  futureValue: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * ResultsCard component displays SIP calculation results including total investment,
 * estimated returns, future value, and provides access to detailed breakdowns via dialogs.
 */
export function ResultsCard({
  totalInvestment,
  estimatedReturns,
  futureValue,
  yearlyBreakdown,
}: ResultsCardProps) {
  // Calculate percentages for the progress bar visualization
  const investmentPercentage = futureValue > 0 ? (totalInvestment / futureValue) * 100 : 0;
  const returnsPercentage = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;
  
  // Calculate return ratio to determine if gains are more or less than 100%
  // If < 1 (less than 100%), show as percentage; otherwise show as multiplier (e.g., 2.5x)
  const returnRatio = totalInvestment > 0 ? (futureValue - totalInvestment) / totalInvestment : 0;
  const centerText = returnRatio < 1 
    ? `${(returnRatio * 100).toFixed(1)}% Returns`
    : `${(returnRatio).toFixed(2)}x Returns`;

  // Configure table columns with alignment, widths, and styling for yearly breakdown
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "investment", label: "Invested", align: "right" as const, minWidth: "110px" },
    { key: "totalInvested", label: "Total Invested", align: "right" as const, minWidth: "130px" },
    { key: "interestEarned", label: "Interest Earned", align: "right" as const, minWidth: "140px", className: "text-green-600" },
    { key: "yearEndValue", label: "Year End Value", align: "right" as const, minWidth: "140px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    investment: row.investment,
    totalInvested: row.totalInvested,
    interestEarned: row.interestEarned,
    yearEndValue: row.yearEndValue,
  }));

  // Format table cells: year as plain number, all other values as currency
  const formatCell = (key: string, value: any) => {
    if (key === "year") {
      return value;
    }
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  // Highlight every 5th row for better readability
  const highlightRow = (rowIndex: number) => {
    return (rowIndex + 1) % 5 === 0;
  };

  // Prepare chart data starting from year 0 to show investment growth trajectory
  const chartData = [
    { year: 0, invested: 0, futureValue: 0 },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      invested: row.totalInvested,
      futureValue: row.yearEndValue,
    })),
  ];

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

  // Format large currency values for Y-axis (Cr for Crores, L for Lakhs, K for Thousands)
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  // Format tooltip values to display full currency amount with Indian number format
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
            description="Detailed annual progression of your SIP investment"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Growth Chart"
            title="Investment Growth Over Time"
            description="Visual representation of your portfolio growth and compounding effect"
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
