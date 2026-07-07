export function createKnowledgeResolver(fetchFn) {
    return {
        async resolve(target) {
            return fetchFn(target);
        },
        async resolveBatch(targets) {
            const results = new Map();
            const unique = [...new Set(targets)];
            const settled = await Promise.allSettled(unique.map(t => fetchFn(t)));
            for (let i = 0; i < unique.length; i++) {
                const r = settled[i];
                if (r.status === "fulfilled" && r.value) {
                    results.set(unique[i], r.value);
                }
            }
            return results;
        },
        async resolveBySlug(slug) {
            return fetchFn(slug);
        },
        async resolveById(id) {
            return fetchFn(id);
        },
    };
}
