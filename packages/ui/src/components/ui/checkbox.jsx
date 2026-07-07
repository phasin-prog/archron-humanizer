import * as React from "react";
import { cn } from "../../lib/utils";
const Checkbox = React.forwardRef(({ className, label, id, ...props }, ref) => (<label className={cn("flex items-center gap-2 cursor-pointer text-body", className)}>
      <input type="checkbox" className="h-4 w-4 rounded border accent-primary cursor-pointer" ref={ref} id={id} {...props}/>
      {label && <span>{label}</span>}
    </label>));
Checkbox.displayName = "Checkbox";
export { Checkbox };
