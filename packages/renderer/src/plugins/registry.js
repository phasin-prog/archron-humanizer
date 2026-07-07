export function createPluginRegistry(initialPlugins = {}) {
    const plugins = new Map(Object.entries(initialPlugins));
    return {
        plugins,
        register(name, plugin) {
            plugins.set(name, plugin);
        },
        get(name) {
            return plugins.get(name);
        },
        list() {
            return Array.from(plugins.keys());
        },
        remove(name) {
            plugins.delete(name);
        },
    };
}
