export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trimEnd() + "...";
}
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
export function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural ?? `${singular}s`;
}
