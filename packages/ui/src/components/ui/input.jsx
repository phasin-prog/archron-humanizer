import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const inputVariants = cva("flex w-full rounded-md border bg-surface px-3 py-2 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "border-input",
            error: "border-destructive focus:ring-destructive/20 focus:border-destructive",
        },
    },
    defaultVariants: { variant: "default" },
});
const Input = React.forwardRef(({ className, variant, error, ...props }, ref) => (<div className="w-full">
      <input className={cn(inputVariants({ variant: error ? "error" : variant }), className)} ref={ref} {...props}/>
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>));
Input.displayName = "Input";
export { Input, inputVariants };
