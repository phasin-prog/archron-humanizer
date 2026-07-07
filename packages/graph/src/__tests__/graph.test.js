import { describe, it, expect } from "vitest";
import { createGraphScene, disposeGraphScene, NODE_TYPE_COLORS } from "../index";
function makeData() {
    return {
        nodes: [
            { id: "n1", objectId: "o1", label: "Shadow", type: "concept", x: 50, y: 50, z: 0, size: 10, color: "#8b5cf6", influenceScore: 5, degree: 2, isHighlighted: false, metadata: {} },
            { id: "n2", objectId: "o2", label: "Persona", type: "concept", x: 150, y: 50, z: 0, size: 8, color: "#8b5cf6", influenceScore: 3, degree: 1, isHighlighted: false, metadata: {} },
            { id: "n3", objectId: "o3", label: "Jung", type: "thinker", x: 100, y: 150, z: 0, size: 12, color: "#06b6d4", influenceScore: 8, degree: 2, isHighlighted: false, metadata: {} },
        ],
        edges: [
            { id: "e1", source: "n1", target: "n3", weight: 1, color: "#334155", opacity: 0.6 },
            { id: "e2", source: "n2", target: "n3", weight: 0.8, color: "#334155", opacity: 0.5 },
        ],
    };
}
describe("createGraphScene", () => {
    it("mounts a canvas element into the container", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const scene = createGraphScene(container, makeData(), { width: 200, height: 200 });
        expect(container.firstChild).not.toBeNull();
        expect(container.firstChild.tagName).toBe("CANVAS");
        scene.dispose();
    });
    it("exposes render, update, highlight, reset, and dispose methods", () => {
        const container = document.createElement("div");
        const scene = createGraphScene(container, makeData());
        expect(typeof scene.render).toBe("function");
        expect(typeof scene.update).toBe("function");
        expect(typeof scene.highlight).toBe("function");
        expect(typeof scene.reset).toBe("function");
        expect(typeof scene.dispose).toBe("function");
        scene.dispose();
    });
});
describe("GraphScene.highlight", () => {
    it("sets isHighlighted=true only on the matching node", () => {
        const container = document.createElement("div");
        const scene = createGraphScene(container, makeData());
        scene.highlight("n2");
        const highlighted = scene.data.nodes.filter((n) => n.isHighlighted);
        expect(highlighted).toHaveLength(1);
        expect(highlighted[0].id).toBe("n2");
        scene.dispose();
    });
});
describe("GraphScene.reset", () => {
    it("clears isHighlighted on every node", () => {
        const container = document.createElement("div");
        const scene = createGraphScene(container, makeData());
        scene.highlight("n1");
        scene.reset();
        const stillHighlighted = scene.data.nodes.filter((n) => n.isHighlighted);
        expect(stillHighlighted).toHaveLength(0);
        scene.dispose();
    });
});
describe("GraphScene.dispose", () => {
    it("removes all children from the container", () => {
        const container = document.createElement("div");
        const scene = createGraphScene(container, makeData());
        expect(container.childNodes.length).toBeGreaterThan(0);
        scene.dispose();
        expect(container.childNodes.length).toBe(0);
    });
});
describe("disposeGraphScene", () => {
    it("calls dispose on the scene", () => {
        const container = document.createElement("div");
        const scene = createGraphScene(container, makeData());
        disposeGraphScene(scene);
        expect(container.childNodes.length).toBe(0);
    });
});
describe("NODE_TYPE_COLORS", () => {
    it("exports a color for each domain object type", () => {
        expect(NODE_TYPE_COLORS.concept).toBe("#8b5cf6");
        expect(NODE_TYPE_COLORS.thinker).toBe("#06b6d4");
        expect(NODE_TYPE_COLORS.book).toBe("#3b82f6");
    });
});
