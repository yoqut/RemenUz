/** Full-size image URL: some -small/-medium variants are missing on api.remen.uz, the originals are not. */
export const fullImg = (url: string | null) => (url ? url.replace(/-(?:small|medium|micro)(\.\w+)$/, "$1") : null);
