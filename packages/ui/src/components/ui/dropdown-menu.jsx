"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
const DropdownContext = React.createContext(null);
function useDropdown() {
    const ctx = React.useContext(DropdownContext);
    if (!ctx)
        throw new Error("DropdownMenu components must be used within <DropdownMenu>");
    return ctx;
}
function DropdownMenu({ children }) {
    const [open, setOpen] = React.useState(false);
    return (<DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>);
}
function DropdownMenuTrigger({ children, className, ...props }) {
    const { open, setOpen } = useDropdown();
    return (<button type="button" onClick={() => setOpen(!open)} className={className} {...props}>
      {children}
    </button>);
}
function DropdownMenuContent({ children, className, align = "start", ...props }) {
    const { open } = useDropdown();
    if (!open)
        return null;
    return (<div className={cn("absolute z-50 mt-1 min-w-[180px] rounded-md border bg-surface p-1 shadow-md", align === "end" ? "right-0" : "left-0", className)} {...props}>
      {children}
    </div>);
}
function DropdownMenuItem({ children, className, ...props }) {
    const { setOpen } = useDropdown();
    return (<div className={cn("flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-body hover:bg-muted transition-colors", className)} onClick={() => setOpen(false)} {...props}>
      {children}
    </div>);
}
function DropdownMenuSeparator({ className, ...props }) {
    return <div className={cn("my-1 h-px bg-border", className)} {...props}/>;
}
function DropdownMenuLabel({ className, ...props }) {
    return <div className={cn("px-2 py-1.5 text-caption font-medium text-muted-foreground", className)} {...props}/>;
}
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };
