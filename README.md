# Remen.uz — Liquid Glass

A Next.js 16 (App Router) build of the "Remen.uz — редизайн" design. The original design artboards are in `design/`.

## Pages

| Route | Artboard |
|---|---|
| `/` | GlassMain — home page |
| `/product` | GlassProduct — product card |
| `/cart` | GlassCart — cart and checkout |
| `/guide` | GlassGuide — how to choose and measure a belt |
| `/business` | GlassBusiness — for business and partners |
| `/info/[slug]` | GlassInfo — about, contacts, news, brands, offer, howto, delivery, payment, returns, inst |

The site has RU/UZ language switching. The chosen language is saved in `localStorage`.

## Running

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploying to Vercel through GitHub

1. Push this repository to GitHub.
2. Open [vercel.com/new](https://vercel.com/new) and import the repository. Vercel detects Next.js automatically, so you don't need to change any settings.
3. Every push to `main` now deploys automatically.
