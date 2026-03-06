Comparison pages (/compare/city-a-vs-city-b) are excluded from the sitemap for now due to memory constraints (O(N²) URL count).

To add them back:
- The source endpoint exists at src/server/api/__sitemap__/comparisons.ts
- Add chunked named sitemaps to nuxt.config.ts (similar to cities-0..N pattern)
- COMPARISON_CHUNKS needs to be large enough that each chunk response stays under Vercel's 4.5MB payload limit
- Consider whether all language variants are needed, or English-only to reduce payload size
- With 500+ cities the total URL count is 500*499/2 * 11 langs ≈ 1.4M URLs — verify Google can index them all before adding
