export function generateFlaskKey() {
    return Math.random().toString(36).slice(-24);
}