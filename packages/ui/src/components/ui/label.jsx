import * as React from "react";
import { cn } from "../../lib/utils";
const Label = React.forwardRef(({ className, children, required, ...props }, ref) => (<label className={cn("text-body font-medium leading-none", className)} ref={ref} {...props}>
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>));
Label.displayName = "Label";
export { Label };
