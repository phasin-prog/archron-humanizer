export function isNonEmpty(value) {
    return value.trim().length > 0;
}
export function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}
export function isWithinRange(value, min, max) {
    return value >= min && value <= max;
}
export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
