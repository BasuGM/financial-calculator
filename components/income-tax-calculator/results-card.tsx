import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { TableDialog } from "@/components/common/table-dialog";
import { ChartDialog } from "@/components/common/chart-dialog";

/**
 * Represents the tax calculation for a single income tax slab
 */
export interface TaxSlabBreakdown {
  slab: string;
  income: number;
  rate: number;
  tax: number;
}

/**
 * Props for the ResultsCard component
 */
interface ResultsCardProps {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  taxSlabBreakdown: TaxSlabBreakdown[];
}

/**
 * ResultsCard Component
 * Displays the calculated income tax results including gross income, deductions, taxable income,
 * total tax, net income, effective tax rate, and a detailed breakdown by tax slabs
 */
export function ResultsCard({
  grossIncome,
  totalDeductions,
  taxableIncome,
  totalTax,
  netIncome,
  effectiveTaxRate,
  taxSlabBreakdown,
}: ResultsCardProps) {
  // Calculate what percentage of gross income goes to tax
  const taxPercentage = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  // Calculate what percentage of gross income remains as net income
  const netPercentage = grossIncome > 0 ? (netIncome / grossIncome) * 100 : 0;
  // Display the effective tax rate in the center of the progress bar
  const centerText = `${effectiveTaxRate.toFixed(1)}% Tax Rate`;

  // Prepare data for table dialog - define column configuration for tax slab breakdown
  const tableColumns = [
    { key: "slab", label: "Income Slab", align: "left" as const, minWidth: "150px" },
    { key: "income", label: "Taxable Income", align: "right" as const, minWidth: "140px" },
    { key: "rate", label: "Tax Rate", align: "right" as const, minWidth: "100px", className: "text-orange-600" },
    { key: "tax", label: "Tax Amount", align: "right" as const, minWidth: "130px", className: "font-semibold" },
  ];

  // Transform tax slab breakdown data for table display
  const tableData = taxSlabBreakdown.map((row) => ({
    slab: row.slab,
    income: row.income,
    rate: row.rate,
    tax: row.tax,
  }));

  // Format table cells - slab as text, rate as percentage, others as currency
  const formatCell = (key: string, value: any, rowIndex: number) => {
    if (key === "slab") {
      return value;
    }
    if (key === "rate") {
      return `${value}%`;
    }
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  // No row highlighting needed for tax slab breakdown (all rows equally important)
  const highlightRow = (rowIndex: number) => {
    return false; // No highlighting for tax slabs
  };

  // Prepare data for chart dialog (currently unused, but available for future enhancement)
  const chartData = [
    { category: "Income Flow", deductions: totalDeductions, tax: totalTax, netIncome: netIncome },
  ];

  // Define chart lines configuration for deductions, tax, and net income
  const chartLines = [
    {
      dataKey: "deductions",
      name: "Deductions",
      color: "#3b82f6",
      gradientId: "colorDeductions",
    },
    {
      dataKey: "tax",
      name: "Tax",
      color: "#f59e0b",
      gradientId: "colorTax",
    },
    {
      dataKey: "netIncome",
      name: "Net Income",
      color: "#22c55e",
      gradientId: "colorNetIncome",
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
            <span>Gross Annual Income</span>
            <span className="font-semibold text-foreground">
              ₹ {grossIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Deductions</span>
            <span className="font-semibold text-blue-600">
              ₹ {totalDeductions.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxable Income</span>
            <span className="font-semibold text-foreground">
              ₹ {taxableIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Tax</span>
            <span className="font-semibold text-orange-600">
              ₹ {totalTax.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Net Annual Income</span>
              <span className="text-2xl font-bold text-primary">
                ₹ {netIncome.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            <span>Effective Tax Rate</span>
            <span className="font-semibold text-foreground">
              {effectiveTaxRate.toFixed(2)}%
            </span>
          </div>
        </div>

        <ProgressBar
          leftPercentage={netPercentage}
          rightPercentage={taxPercentage}
          centerText={centerText}
          leftLabel="Net Income"
          rightLabel="Tax"
        />

        <div className="grid grid-cols-2 gap-2">
          <TableDialog
            triggerLabel="View Tax Slab Breakdown"
            title="Tax Slab Breakdown"
            description="Detailed calculation across different income tax slabs"
            columns={tableColumns}
            data={tableData}
            formatCell={formatCell}
            highlightRow={highlightRow}
          />          
        </div>
      </CardContent>
    </Card>
  );
}
