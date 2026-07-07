import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Button } from "../components/ui/button";
describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeDefined();
    });
    it("fires the onClick handler when clicked", () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        fireEvent.click(screen.getByText("Click me"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    it("applies the default variant className", () => {
        render(<Button>Default</Button>);
        const el = screen.getByText("Default");
        expect(el.className).toContain("bg-primary");
    });
    it("applies the outline variant className when variant is outline", () => {
        render(<Button variant="outline">Outline</Button>);
        const el = screen.getByText("Outline");
        expect(el.className).toContain("border");
    });
    it("is disabled when the disabled prop is set", () => {
        render(<Button disabled>Disabled</Button>);
        const el = screen.getByText("Disabled");
        expect(el.disabled).toBe(true);
    });
});
