"use client";
import React from "react";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
function range(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}
function getPageNumbers(currentPage, totalPages, siblingCount) {
    const pages = [];
    if (totalPages <= 7 + siblingCount * 2) {
        pages.push(...range(1, totalPages));
        return pages;
    }
    pages.push(1);
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
    if (leftSiblingIndex > 2) {
        pages.push("ellipsis-start");
    }
    else {
        for (let i = 2; i < leftSiblingIndex; i++) {
            pages.push(i);
        }
    }
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
    }
    if (rightSiblingIndex < totalPages - 1) {
        pages.push("ellipsis-end");
    }
    else {
        for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
            pages.push(i);
        }
    }
    if (totalPages > 1) {
        pages.push(totalPages);
    }
    return pages;
}
export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1, className, children, ...props }) {
    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;
    const pages = getPageNumbers(currentPage, totalPages, siblingCount);
    return (<nav className={cn("flex items-center gap-1", className)} role="navigation" aria-label="Pagination" {...props}>
      <PaginationPrevious disabled={isFirstPage} onClick={() => onPageChange(currentPage - 1)}/>

      {pages.map((page, i) => typeof page === "number" ? (<PaginationItem key={`page-${page}`} page={page} isActive={page === currentPage} onClick={() => onPageChange(page)}/>) : (<PaginationItem key={`ellipsis-${i}`} page={0} isActive={false} ellipsis/>))}

      <PaginationNext disabled={isLastPage} onClick={() => onPageChange(currentPage + 1)}/>

      {children}
    </nav>);
}
export function PaginationItem({ className, page, isActive, ellipsis, disabled, ...props }) {
    if (ellipsis) {
        return (<span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground" aria-hidden="true">
        <MoreHorizontal className="h-4 w-4"/>
      </span>);
    }
    return (<button className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:pointer-events-none disabled:opacity-50", isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground", className)} disabled={disabled} aria-current={isActive ? "page" : undefined} {...props}>
      {page}
    </button>);
}
export function PaginationPrevious({ className, disabled, ...props }) {
    return (<button className={cn("inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:pointer-events-none disabled:opacity-50", !disabled && "hover:bg-accent hover:text-accent-foreground", className)} disabled={disabled} {...props}>
      <ChevronLeft className="h-4 w-4"/>
      <span className="hidden sm:inline">Previous</span>
    </button>);
}
export function PaginationNext({ className, disabled, ...props }) {
    return (<button className={cn("inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:pointer-events-none disabled:opacity-50", !disabled && "hover:bg-accent hover:text-accent-foreground", className)} disabled={disabled} {...props}>
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="h-4 w-4"/>
    </button>);
}
