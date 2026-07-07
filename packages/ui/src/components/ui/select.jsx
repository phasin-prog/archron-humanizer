import * as React from "react";
import { cn } from "../../lib/utils";
const Select = React.forwardRef(({ className, options, placeholder, error, ...props }, ref) => (<div className="w-full">
      <select className={cn("flex w-full rounded-md border bg-surface px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50 appearance-none", error && "border-destructive", className)} ref={ref} {...props}>
        {placeholder && (<option value="" disabled>{placeholder}</option>)}
        {options.map((opt) => (<option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>))}
      </select>
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>));
Select.displayName = "Select";
export { Select };
