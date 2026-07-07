import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
describe("Card", () => {
    it("renders its children inside the card body", () => {
        render(<Card data-testid="card">
        <span>body content</span>
      </Card>);
        const card = screen.getByTestId("card");
        expect(card.tagName).toBe("DIV");
        expect(card.className).toContain("rounded-xl");
        expect(card.textContent).toContain("body content");
    });
});
describe("CardHeader, CardTitle, CardDescription", () => {
    it("renders a title and description", () => {
        render(<Card>
        <CardHeader>
          <CardTitle>Shadow</CardTitle>
          <CardDescription>An unconscious archetype</CardDescription>
        </CardHeader>
      </Card>);
        expect(screen.getByText("Shadow").tagName).toBe("H3");
        expect(screen.getByText("An unconscious archetype").tagName).toBe("P");
    });
});
describe("CardContent", () => {
    it("renders children inside the content slot", () => {
        render(<Card>
        <CardContent>
          <p>body</p>
        </CardContent>
      </Card>);
        expect(screen.getByText("body")).toBeDefined();
    });
});
