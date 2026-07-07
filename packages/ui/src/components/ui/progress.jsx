import React from "react";
import { cn } from "../../lib/utils";
export function Progress({ className, value, max = 100, label, ...props }) {
    const isIndeterminate = value === undefined;
    const percentage = isIndeterminate ? 0 : Math.min(Math.max((value ?? 0) / max, 0), 1) * 100;
    return (<div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && (<div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {!isIndeterminate && (<span className="text-xs text-muted-foreground">
              {Math.round(percentage)}%
            </span>)}
        </div>)}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={isIndeterminate ? undefined : value} aria-valuemin={0} aria-valuemax={max} aria-valuetext={isIndeterminate ? undefined : `${Math.round(percentage)}%`}>
        {isIndeterminate ? (<div className="h-full w-1/3 rounded-full bg-primary animate-indeterminate"/>) : (<div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${percentage}%` }}/>)}
      </div>
    </div>);
}
