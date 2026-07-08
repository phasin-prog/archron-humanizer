import { NextResponse } from "next/server";
import { getAuth, rateLimit, rateLimitHeaders } from "@archron/auth";
export async function POST(request) {
    const { userId } = await getAuth();
    if (!userId) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const rl = rateLimit({
        key: `chat:${userId}`,
        limit: 20,
        windowMs: 60000,
    });
    if (!rl.success) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: rateLimitHeaders(rl) });
    }
    let message;
    try {
        const body = await request.json();
        message = body.message ?? "";
    }
    catch {
        message = "";
    }
    if (!message.trim()) {
        return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    const lower = message.toLowerCase();
    if (lower.includes("shadow")) {
        return NextResponse.json({
            response: "The Shadow is one of Carl Jung's core archetypes. It represents the unconscious, repressed aspects of the personality — traits, desires, and impulses the conscious ego rejects or denies. Integrating the Shadow is central to individuation, the lifelong process of becoming whole.",
        });
    }
    if (lower.includes("archetype")) {
        return NextResponse.json({
            response: "Archetypes are universal, primordial patterns embedded in the collective unconscious. Jung identified several — the Persona (social mask), the Shadow (hidden self), the Anima/Animus (contrasexual soul-image), and the Self (totality of the psyche). Archetypes manifest in myths, dreams, art, and recurring human narratives across all cultures.",
        });
    }
    if (lower.includes("jung") && lower.includes("freud")) {
        return NextResponse.json({
            response: "Freud and Jung began as collaborators but diverged fundamentally. Freud emphasized the personal unconscious driven by repressed sexual and aggressive instincts. Jung expanded the model to include the collective unconscious, universal archetypes, and a forward-looking libido. Their split in 1913 marked the birth of Analytical Psychology as distinct from Psychoanalysis.",
        });
    }
    return NextResponse.json({
        response: "That is a fascinating question. While I am still a placeholder, I will soon be able to draw on the full ARCHRON knowledge graph to give you accurate answers grounded in source material.",
    });
}
