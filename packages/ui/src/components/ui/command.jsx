"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
const CommandContext = React.createContext(null);
function useCommand() {
    const ctx = React.useContext(CommandContext);
    if (!ctx)
        throw new Error("Command components must be used within <Command>");
    return ctx;
}
function Command({ children, className, ...props }) {
    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);
    return (<CommandContext.Provider value={{ search, setSearch, open, setOpen }}>
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CommandContext.Provider>);
}
function CommandDialog({ children, className, ...props }) {
    const { open, setOpen } = useCommand();
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}/>
      <div className={cn("relative z-50 w-full max-w-lg rounded-lg border bg-surface shadow-lg", className)} {...props}>
        {children}
      </div>
    </div>);
}
function CommandInput({ className, placeholder = "Type a command or search...", ...props }) {
    const { search, setSearch } = useCommand();
    return (<div className="flex items-center border-b px-3">
      <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input className={cn("flex h-11 w-full rounded-md bg-transparent py-3 text-body outline-none placeholder:text-muted-foreground", className)} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} {...props}/>
    </div>);
}
function CommandList({ children, className, ...props }) {
    return (<div className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-1", className)} {...props}>
      {children}
    </div>);
}
function CommandEmpty({ children, className, ...props }) {
    return (<div className={cn("py-6 text-center text-caption text-muted-foreground", className)} {...props}>
      {children}
    </div>);
}
function CommandGroup({ children, className, heading, ...props }) {
    return (<div className={cn("overflow-hidden p-1 text-foreground", className)} {...props}>
      {heading && (<div className="px-2 py-1.5 text-caption font-medium text-muted-foreground">
          {heading}
        </div>)}
      {children}
    </div>);
}
function CommandItem({ children, className, onSelect, ...props }) {
    const { setOpen } = useCommand();
    return (<div className={cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body outline-none hover:bg-muted transition-colors", className)} onClick={() => {
            onSelect?.();
            setOpen(false);
        }} {...props}>
      {children}
    </div>);
}
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
