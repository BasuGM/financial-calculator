"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";
import { Info } from "lucide-react";

// Interface defining the structure for yearly withdrawal tracking data with step-up increments
export interface YearlyBreakdown {
  year: number;
  withdrawal: number;
  totalWithdrawn: number;
  balanceStart: number;
  balanceEnd: number;
}

interface ResultsCardProps {
  totalWithdrawal: number;
  remainingBalance: number;
  initialInvestment: number;
  depletionMonth: number | null;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * ResultsCard component displays SWP Step Up calculation results including total withdrawals,
 * remaining balance, and depletion alerts. Handles cases where returns exceed withdrawals.
 */
export function ResultsCard({
  totalWithdrawal,
  remainingBalance,
  initialInvestment,
  depletionMonth,
  yearlyBreakdown,
}: ResultsCardProps) {
  // Calculate percentages for the progress bar visualization
  // Shows what portion of initial investment has been withdrawn vs remaining
  const withdrawalPercentage = initialInvestment > 0 ? (totalWithdrawal / initialInvestment) * 100 : 0;
  const remainingPercentage = initialInvestment > 0 ? (remainingBalance / initialInvestment) * 100 : 0;
  
  // Handle cases where returns exceed withdrawals (remaining balance > 100% of initial investment)
  // Show as multiplier (e.g., 2.5x) when > 100%, otherwise show as percentage
  const centerText = remainingPercentage > 100 
    ? `${(remainingPercentage / 100).toFixed(2)}x Remaining`
    : `${remainingPercentage.toFixed(1)}% Remaining`;

  // Configure table columns with alignment, widths, and styling for yearly breakdown
  const tableColumns = [
    { key: "year", label: "Year", align: "left" as const, minWidth: "60px" },
    { key: "withdrawal", label: "Withdrawn", align: "right" as const, minWidth: "120px" },
    { key: "totalWithdrawn", label: "Total Withdrawn", align: "right" as const, minWidth: "140px" },
    { key: "balanceStart", label: "Balance Start", align: "right" as const, minWidth: "130px", className: "text-muted-foreground" },
    { key: "balanceEnd", label: "Balance End", align: "right" as const, minWidth: "130px", className: "font-semibold" },
  ];

  const tableData = yearlyBreakdown.map((row) => ({
    year: row.year,
    withdrawal: row.withdrawal,
    totalWithdrawn: row.totalWithdrawn,
    balanceStart: row.balanceStart,
    balanceEnd: row.balanceEnd,
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

  // Prepare chart data starting from year 0 to show withdrawal and balance trajectory
  const chartData = [
    { year: 0, withdrawn: 0, balance: initialInvestment },
    ...yearlyBreakdown.map((row) => ({
      year: row.year,
      withdrawn: row.totalWithdrawn,
      balance: row.balanceEnd,
    })),
  ];

  const chartLines = [
    {
      dataKey: "withdrawn",
      name: "Total Withdrawn",
      color: "#3b82f6",
      gradientId: "colorWithdrawn",
    },
    {
      dataKey: "balance",
      name: "Remaining Balance",
      color: "#22c55e",
      gradientId: "colorBalance",
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
            <span>Initial Investment</span>
            <span className="font-semibold text-foreground">
              ₹ {initialInvestment.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Withdrawal</span>
            <span className="font-semibold text-blue-600">
              ₹ {totalWithdrawal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Remaining Balance</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {remainingBalance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          leftPercentage={remainingPercentage}
          rightPercentage={withdrawalPercentage}
          centerText={centerText}
          leftLabel="Remaining"
          rightLabel="Withdrawn"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Year-by-Year Breakdown"
            title="Year-by-Year Breakdown"
            description="Detailed annual progression of your SWP step-up withdrawals"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />
          <ChartDialog
            triggerLabel="View Withdrawal Progress"
            title="Withdrawal Progress Over Time"
            description="Visual representation of your portfolio depletion with step-up withdrawals"
            data={chartData}
            lines={chartLines}
            xAxisKey="year"
            xAxisLabel="Years"
            yAxisLabel="Amount"
            formatYAxis={formatCurrency}
            formatTooltip={formatTooltip}
          />
        </div>

        {depletionMonth && (
          <Alert className="rounded-none">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Fund depleted after {Math.floor(depletionMonth / 12)} years{" "}
              {depletionMonth % 12} months
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
