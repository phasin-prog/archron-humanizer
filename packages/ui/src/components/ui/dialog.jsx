"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
const DialogContext = React.createContext(null);
function useDialog() {
    const ctx = React.useContext(DialogContext);
    if (!ctx)
        throw new Error("Dialog components must be used within <Dialog>");
    return ctx;
}
function Dialog({ open: controlledOpen, onOpenChange, children }) {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const open = controlledOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;
    return (<DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>);
}
function DialogTrigger({ children, className, ...props }) {
    const { setOpen } = useDialog();
    return (<button type="button" onClick={() => setOpen(true)} className={className} {...props}>
      {children}
    </button>);
}
function DialogContent({ children, className, ...props }) {
    const { open, setOpen } = useDialog();
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}/>
      <div className={cn("relative z-50 w-full max-w-lg rounded-lg border bg-surface p-6 shadow-lg animate-in fade-in zoom-in-95", className)} {...props}>
        {children}
        <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100" aria-label="Close">
          ✕
        </button>
      </div>
    </div>);
}
function DialogHeader({ className, ...props }) {
    return <div className={cn("flex flex-col gap-1.5", className)} {...props}/>;
}
function DialogTitle({ className, ...props }) {
    return <h2 className={cn("text-card-title font-serif font-semibold", className)} {...props}/>;
}
function DialogDescription({ className, ...props }) {
    return <p className={cn("text-caption text-muted-foreground", className)} {...props}/>;
}
function DialogFooter({ className, ...props }) {
    return <div className={cn("flex justify-end gap-2 mt-4", className)} {...props}/>;
}
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
