"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@archron/ui";
const NODE_RADIUS_MIN = 6;
const NODE_RADIUS_MAX = 16;
const HIT_TARGET = 14;
const BG_COLOR = "#141821";
const TEXT_COLOR = "#ECEFF4";
function scaleRadius(size) {
    return NODE_RADIUS_MIN + ((size - 1) / 9) * (NODE_RADIUS_MAX - NODE_RADIUS_MIN);
}
export function ConstellationScene({ nodes, edges, className, }) {
    const router = useRouter();
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [draggingId, setDraggingId] = useState(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const nodePositions = useRef(new Map());
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);
    const hoveredRef = useRef(hoveredId);
    const panRef = useRef(panOffset);
    nodesRef.current = nodes;
    edgesRef.current = edges;
    hoveredRef.current = hoveredId;
    panRef.current = panOffset;
    useEffect(() => {
        const map = nodePositions.current;
        for (const node of nodes) {
            if (!map.has(node.id)) {
                map.set(node.id, { x: node.x, y: node.y });
            }
        }
    }, [nodes]);
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const currentNodes = nodesRef.current;
        const currentEdges = edgesRef.current;
        const currentHovered = hoveredRef.current;
        const { x: px, y: py } = panRef.current;
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);
        const weightValues = currentEdges.map((e) => e.weight);
        const maxWeight = Math.max(...weightValues, 1);
        for (const edge of currentEdges) {
            const sourcePos = nodePositions.current.get(edge.source);
            const targetPos = nodePositions.current.get(edge.target);
            if (!sourcePos || !targetPos)
                continue;
            const sx = sourcePos.x + px;
            const sy = sourcePos.y + py;
            const tx = targetPos.x + px;
            const ty = targetPos.y + py;
            const midX = (sx + tx) / 2;
            const midY = (sy + ty) / 2 + (tx - sx) * 0.15;
            const lineWidth = 0.5 + (edge.weight / maxWeight) * 3;
            const alpha = edge.opacity ?? 0.35;
            const isRelated = currentHovered &&
                (edge.source === currentHovered || edge.target === currentHovered);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(midX, midY, tx, ty);
            ctx.strokeStyle = edge.color ?? "#334155";
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = isRelated ? Math.min(1, alpha * 2) : alpha;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        for (const node of currentNodes) {
            const pos = nodePositions.current.get(node.id);
            if (!pos)
                continue;
            const nx = pos.x + px;
            const ny = pos.y + py;
            const radius = scaleRadius(node.size);
            const isDimmed = currentHovered &&
                currentHovered !== node.id &&
                !currentEdges.some((e) => (e.source === currentHovered && e.target === node.id) ||
                    (e.target === currentHovered && e.source === node.id));
            ctx.globalAlpha = isDimmed ? 0.2 : 1;
            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color ?? "#C49B55";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (node.highlighted || currentHovered === node.id) {
                ctx.beginPath();
                ctx.arc(nx, ny, radius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = node.color ?? "#C49B55";
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
            }
            ctx.globalAlpha = isDimmed ? 0.3 : 1;
            ctx.fillStyle = TEXT_COLOR;
            ctx.font = "12px Inter, system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(node.label, nx, ny - radius - 6);
        }
        ctx.globalAlpha = 1;
    }, []);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const observer = new ResizeObserver(() => {
            draw();
        });
        observer.observe(canvas);
        draw();
        return () => observer.disconnect();
    }, [draw]);
    useEffect(() => {
        draw();
    }, [nodes, edges, hoveredId, panOffset, draw]);
    const hitTest = useCallback((wx, wy) => {
        const currentNodes = nodesRef.current;
        for (let i = currentNodes.length - 1; i >= 0; i--) {
            const node = currentNodes[i];
            if (!node)
                continue;
            const pos = nodePositions.current.get(node.id);
            if (!pos)
                continue;
            const dx = wx - pos.x;
            const dy = wy - pos.y;
            const threshold = Math.max(HIT_TARGET, scaleRadius(node.size));
            if (dx * dx + dy * dy < threshold * threshold) {
                return node.id;
            }
        }
        return null;
    }, []);
    const handleMouseMove = useCallback((e) => {
        if (isPanning) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            dragStart.current = { x: e.clientX, y: e.clientY };
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const { x: px, y: py } = panRef.current;
        const wx = e.clientX - rect.left - px;
        const wy = e.clientY - rect.top - py;
        if (draggingId) {
            nodePositions.current.set(draggingId, { x: wx, y: wy });
            draw();
            return;
        }
        const hit = hitTest(wx, wy);
        setHoveredId((prev) => (prev === hit ? prev : hit));
    }, [isPanning, draggingId, hitTest, draw]);
    const handleMouseDown = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const { x: px, y: py } = panRef.current;
        const wx = e.clientX - rect.left - px;
        const wy = e.clientY - rect.top - py;
        const hit = hitTest(wx, wy);
        if (hit) {
            setDraggingId(hit);
        }
        else {
            setIsPanning(true);
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
    }, [hitTest]);
    const handleMouseUp = useCallback(() => {
        setDraggingId(null);
        setIsPanning(false);
    }, []);
    const handleClick = useCallback((e) => {
        if (draggingId)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const { x: px, y: py } = panRef.current;
        const wx = e.clientX - rect.left - px;
        const wy = e.clientY - rect.top - py;
        const hit = hitTest(wx, wy);
        if (hit) {
            const node = nodesRef.current.find((n) => n.id === hit);
            if (node) {
                router.push(`/${node.slug}`);
            }
        }
    }, [draggingId, hitTest, router]);
    return (<div ref={containerRef} className={cn("relative w-full h-[600px] overflow-hidden rounded-xl border border-border bg-background", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={handleClick} style={{ cursor: isPanning ? "grabbing" : draggingId ? "grabbing" : hoveredId ? "pointer" : "grab" }}/>
    </div>);
}
