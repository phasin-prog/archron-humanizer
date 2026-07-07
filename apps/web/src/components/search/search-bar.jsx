"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    function handleSubmit(e) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    }
    return (<form onSubmit={handleSubmit}>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Everything..." className="w-full rounded-xl border border-border bg-card px-5 py-4 text-center font-serif text-body text-text placeholder:text-text-disabled focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-[var(--motion-normal)]"/>
    </form>);
}
