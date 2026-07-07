"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
const PopoverContext = React.createContext(null);
function usePopover() {
    const ctx = React.useContext(PopoverContext);
    if (!ctx)
        throw new Error("Popover components must be used within <Popover>");
    return ctx;
}
function Popover({ children }) {
    const [open, setOpen] = React.useState(false);
    return (<PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>);
}
function PopoverTrigger({ children, className, ...props }) {
    const { open, setOpen } = usePopover();
    return (<button type="button" onClick={() => setOpen(!open)} className={className} {...props}>
      {children}
    </button>);
}
function PopoverContent({ children, className, ...props }) {
    const { open, setOpen } = usePopover();
    if (!open)
        return null;
    return (<>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
      <div className={cn("absolute z-50 mt-1 rounded-md border bg-surface p-4 shadow-md min-w-[200px]", className)} {...props}>
        {children}
      </div>
    </>);
}
export { Popover, PopoverTrigger, PopoverContent };
