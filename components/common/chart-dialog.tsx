import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ChartLine {
  dataKey: string;
  name: string;
  color: string;
  gradientId: string;
}

interface ChartDialogProps {
  triggerLabel: string;
  title: string;
  description: string;
  data: Record<string, any>[];
  lines: ChartLine[];
  xAxisKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number | undefined) => string;
  height?: string;
}

export function ChartDialog({
  triggerLabel,
  title,
  description,
  data,
  lines,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  formatYAxis,
  formatTooltip,
  height = "350px",
}: ChartDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-none" disabled={!data || data.length <= 1}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-5xl max-h-[80vh] rounded-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className={`w-full`} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                {lines.map((line) => (
                  <linearGradient key={line.gradientId} id={line.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={line.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={line.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={xAxisKey}
                label={{ value: xAxisLabel, position: "insideBottom", offset: -10 }}
                className="text-sm"
              />
              <YAxis
                tickFormatter={formatYAxis}
                label={{ value: yAxisLabel, angle: -90, position: "insideLeft", offset: 10 }}
                className="text-sm"
                width={110}
              />
              <Tooltip
                formatter={formatTooltip}
                position={{ x: 100, y: 50 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 0,
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                wrapperStyle={{ paddingBottom: "10px" }}
              />
              {lines.map((line, index) => (
                <Area
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stackId={index === 0 ? "1" : undefined}
                  stroke={line.color}
                  fill={`url(#${line.gradientId})`}
                  name={line.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
