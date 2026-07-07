import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const switchVariants = cva("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        checked: {
            true: "bg-primary",
            false: "bg-muted",
        },
    },
});
const thumbVariants = cva("pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform", {
    variants: {
        checked: {
            true: "translate-x-4",
            false: "translate-x-0",
        },
    }
});
const Switch = React.forwardRef(({ className, label, checked, ...props }, ref) => (<label className={cn("flex items-center gap-2 cursor-pointer", className)}>
      <input type="checkbox" className="sr-only" ref={ref} checked={checked} {...props}/>
      <span className={switchVariants({ checked: !!checked })}>
        <span className={thumbVariants({ checked: !!checked })}/>
      </span>
      {label && <span className="text-body">{label}</span>}
    </label>));
Switch.displayName = "Switch";
export { Switch, switchVariants, thumbVariants };
