"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
const SheetContext = React.createContext(null);
function useSheet() {
    const ctx = React.useContext(SheetContext);
    if (!ctx)
        throw new Error("Sheet components must be used within <Sheet>");
    return ctx;
}
function Sheet({ open: controlledOpen, onOpenChange, children }) {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const open = controlledOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;
    return (<SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>);
}
function SheetTrigger({ children, className, ...props }) {
    const { setOpen } = useSheet();
    return (<button type="button" onClick={() => setOpen(true)} className={className} {...props}>
      {children}
    </button>);
}
const sideClasses = {
    top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
};
function SheetContent({ children, className, side = "right", ...props }) {
    const { open, setOpen } = useSheet();
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}/>
      <div className={cn("fixed z-50 gap-4 bg-surface p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", sideClasses[side], className)} data-state="open" {...props}>
        {children}
        <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100" aria-label="Close">
          ✕
        </button>
      </div>
    </div>);
}
function SheetHeader({ className, ...props }) {
    return <div className={cn("flex flex-col gap-1.5", className)} {...props}/>;
}
function SheetTitle({ className, ...props }) {
    return <h2 className={cn("text-card-title font-serif font-semibold", className)} {...props}/>;
}
function SheetDescription({ className, ...props }) {
    return <p className={cn("text-caption text-muted-foreground", className)} {...props}/>;
}
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
