
export function generateFlaskKeyAlphaNum(length = 32): string {
    const bytes = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes);
    } else {
        // Fallback inseguro, solo para entornos sin crypto
        for (let i = 0; i < length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    // Convertir a base64 URL-safe
    let base64 = btoa(String.fromCharCode(...bytes));
    // Hacerlo URL-safe: reemplazar + por -, / por _ y quitar =
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64;
}
