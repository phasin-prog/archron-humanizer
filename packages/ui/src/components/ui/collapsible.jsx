"use client";
import React from "react";
import { cn } from "../../lib/utils";
const CollapsibleContext = React.createContext(null);
function useCollapsible() {
    const ctx = React.useContext(CollapsibleContext);
    if (!ctx)
        throw new Error("Collapsible compound components must be used within <Collapsible>");
    return ctx;
}
export function Collapsible({ open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...props }) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const handleOpenChange = React.useCallback((next) => {
        if (!isControlled)
            setInternalOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    return (<CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>);
}
export function CollapsibleTrigger({ className, asChild, children, ...props }) {
    const { open, onOpenChange } = useCollapsible();
    if (asChild && React.isValidElement(children)) {
        const rawProps = children.props;
        const existingOnClick = rawProps.onClick;
        return React.cloneElement(children, {
            onClick: (...args) => {
                onOpenChange(!open);
                existingOnClick?.(...args);
            },
            "aria-expanded": open,
            ...props,
        });
    }
    return (<button className={cn("inline-flex items-center justify-center", className)} onClick={() => onOpenChange(!open)} aria-expanded={open} type="button" {...props}>
      {children}
    </button>);
}
export function CollapsibleContent({ className, children, ...props }) {
    const { open } = useCollapsible();
    const ref = React.useRef(null);
    const [contentHeight, setContentHeight] = React.useState(0);
    React.useEffect(() => {
        if (ref.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setContentHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(ref.current);
            return () => resizeObserver.disconnect();
        }
        return;
    }, []);
    return (<div className={cn("overflow-hidden transition-[height] duration-300 ease-in-out", className)} style={{ height: open ? contentHeight : 0 }} aria-hidden={!open} {...props}>
      <div ref={ref}>
        {children}
      </div>
    </div>);
}
