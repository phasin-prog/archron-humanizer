import * as React from "react"
import { cn } from "../../lib/utils"

export interface RadioItem {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioItem[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

function RadioGroup({ name, options, value, onChange, className, orientation = "vertical" }: RadioGroupProps) {
  return (
    <div className={cn(
      orientation === "horizontal" ? "flex gap-4" : "flex flex-col gap-2",
      className,
    )}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn("flex items-center gap-2 cursor-pointer text-body", opt.disabled && "opacity-50 cursor-not-allowed")}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={opt.disabled}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export { RadioGroup }
