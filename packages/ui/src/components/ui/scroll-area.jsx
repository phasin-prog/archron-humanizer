import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const scrollAreaVariants = cva("overflow-auto", {
    variants: {
        orientation: {
            vertical: "overflow-y-auto overflow-x-hidden",
            horizontal: "overflow-x-auto overflow-y-hidden",
            both: "overflow-auto",
        },
    },
    defaultVariants: {
        orientation: "vertical",
    },
});
export function ScrollArea({ className, orientation, viewportClassName, children, ...props }) {
    return (<div className={cn("relative overflow-hidden", className)} {...props}>
      <div className={cn(scrollAreaVariants({ orientation }), "h-full w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40", viewportClassName)}>
        {children}
      </div>
    </div>);
}
export { scrollAreaVariants };
