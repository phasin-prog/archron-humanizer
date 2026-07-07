const DEFAULT_CONFIG = {
    width: 800,
    height: 600,
    backgroundColor: "#0a0a0a",
    nodeDefaultColor: "#6366f1",
    edgeDefaultColor: "#334155",
    highlightColor: "#f59e0b",
    nodeMinSize: 4,
    nodeMaxSize: 20,
    edgeMinWidth: 0.5,
    edgeMaxWidth: 4,
    enableZoom: true,
    enableDrag: true,
    enableLabels: true,
    forceStrength: -300,
    forceLinkDistance: 100,
};
export function createGraphScene(container, data, config = {}) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const scene = {
        container,
        config: mergedConfig,
        data,
        render() {
            renderToCanvas(container, this.data, this.config);
        },
        update(newData) {
            this.data = newData;
            this.render();
        },
        highlight(nodeId) {
            this.data = {
                ...this.data,
                nodes: this.data.nodes.map(n => ({
                    ...n,
                    isHighlighted: n.id === nodeId,
                })),
            };
            this.render();
        },
        reset() {
            this.data = {
                ...this.data,
                nodes: this.data.nodes.map(n => ({ ...n, isHighlighted: false })),
            };
            this.render();
        },
        dispose() {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        },
    };
    scene.render();
    return scene;
}
export function disposeGraphScene(scene) {
    scene.dispose();
}
function renderToCanvas(container, data, config) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sizeRange = config.nodeMaxSize - config.nodeMinSize;
    const maxDegree = Math.max(...data.nodes.map(n => n.degree), 1);
    for (const node of data.nodes) {
        const scale = maxDegree > 0 ? node.degree / maxDegree : 0.5;
        const radius = config.nodeMinSize + sizeRange * scale;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isHighlighted ? config.highlightColor : (node.color || config.nodeDefaultColor);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        if (config.enableLabels && radius > 6) {
            ctx.fillStyle = "#ffffff";
            ctx.font = `${Math.max(10, radius * 0.7)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(node.label, node.x, node.y - radius - 4);
        }
    }
    const weightRange = config.edgeMaxWidth - config.edgeMinWidth;
    const maxWeight = Math.max(...data.edges.map(e => e.weight), 1);
    for (const edge of data.edges) {
        const sourceNode = data.nodes.find(n => n.id === edge.source);
        const targetNode = data.nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode)
            continue;
        const scale = maxWeight > 0 ? edge.weight / maxWeight : 0.5;
        const lineWidth = config.edgeMinWidth + weightRange * scale;
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = edge.color || config.edgeDefaultColor;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = edge.opacity || 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}
export const NODE_TYPE_COLORS = {
    concept: "#8b5cf6",
    thinker: "#06b6d4",
    theory: "#f59e0b",
    school: "#10b981",
    discipline: "#ec4899",
    book: "#3b82f6",
    article: "#6366f1",
    symbol: "#ef4444",
    quote: "#a3e635",
    timeline_event: "#f97316",
};
