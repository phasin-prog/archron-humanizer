export function formatDate(date) {
    return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
export function formatYearRange(birth, death) {
    if (birth && death)
        return `${birth}–${death}`;
    if (birth)
        return `${birth}–`;
    return "";
}
export function isRecent(date, days = 7) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return date.getTime() > cutoff;
}
