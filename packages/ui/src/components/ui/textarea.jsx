import * as React from "react";
import { cn } from "../../lib/utils";
const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (<div className="w-full">
      <textarea className={cn("flex min-h-[100px] w-full rounded-md border bg-surface px-3 py-2 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50", error && "border-destructive focus:ring-destructive/20 focus:border-destructive", className)} ref={ref} {...props}/>
      {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
    </div>));
Textarea.displayName = "Textarea";
export { Textarea };
