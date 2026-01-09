import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

export function InputField({ id, label, value, onChange, min, max, step, prefix, suffix }: InputFieldProps) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id} className="min-w-fit">{label}</Label>
        <div className="flex items-center gap-2">
          {prefix && <span className="text-2xl">{prefix}</span>}
          <Input
            id={id}
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, '');
              // Prevent multiple decimal points
              const parts = val.split('.');
              if (parts.length > 2) {
                val = parts[0] + '.' + parts.slice(1).join('');
              }
              // Limit to one decimal place
              if (parts.length === 2 && parts[1].length > 1) {
                val = parts[0] + '.' + parts[1].substring(0, 1);
              }
              
              if (val === '' || val === '.') {
                setInputValue(val);
                onChange(0);
              } else {
                const numVal = Number(val);
                if (!isNaN(numVal)) {
                  if (numVal < min) {
                    toast.warning(`Minimum value is ${min.toLocaleString()}`);
                    return;
                  } else if (numVal > max) {
                    toast.warning(`Maximum value is ${max.toLocaleString()}`);
                    return;
                  } else {
                    setInputValue(val);
                    onChange(numVal);
                  }
                }
              }
            }}
            onBlur={() => {
              // Clean up on blur - remove trailing decimal point
              if (inputValue.endsWith('.')) {
                setInputValue(String(value));
              }
            }}
            className="rounded-none text-2xl font-semibold w-32"
          />
          {suffix && <span className="text-2xl">{suffix}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}
