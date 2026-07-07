import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
const skeletonVariants = cva("animate-pulse rounded bg-muted", {
    variants: {
        variant: {
            text: "h-4 w-full",
            circular: "rounded-full",
            rectangular: "rounded-md",
        },
    },
    defaultVariants: {
        variant: "text",
    },
});
export function Skeleton({ className, variant, width, height, style, ...props }) {
    return (<div className={cn(skeletonVariants({ variant }), className)} style={{
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
            ...style,
        }} {...props}/>);
}
export { skeletonVariants };
