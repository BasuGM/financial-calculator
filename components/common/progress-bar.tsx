interface ProgressBarProps {
  leftPercentage: number;
  rightPercentage: number;
  centerText: string;
  leftLabel: string;
  rightLabel: string;
}

export function ProgressBar({ leftPercentage, rightPercentage, centerText, leftLabel, rightLabel }: ProgressBarProps) {
  return (
    <div className="space-y-3 pt-4">
      <div className="relative h-12 w-full bg-muted/50 rounded-none overflow-hidden border border-border">
        <div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{
            width: `${leftPercentage}%`,
          }}
        />
        <div
          className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
          style={{
            left: `${leftPercentage}%`,
            width: `${rightPercentage}%`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white drop-shadow-md">
            {centerText}
          </span>
        </div>
      </div>
      <div className="flex justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-none" />
          <span className="font-medium">{leftLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-none" />
          <span className="font-medium">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
