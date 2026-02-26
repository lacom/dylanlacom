# Cloudflare Pages Deploy

## Dashboard Settings

Use these exact settings in Cloudflare Pages:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist/public`
- Root directory: `/`
- Production branch: `main` (or your default branch)

Set this environment variable for both Production and Preview:

- `NODE_VERSION=22.12.0`

This project already includes:

- `public/_headers` for cache policy
- `public/robots.txt`
- `public/rss.xml` and `public/sitemap.xml` (generated during prebuild)

## CLI Deploy (Optional)

First-time auth:

```bash
npx wrangler login
```

Create the Pages project once (if not already created):

```bash
npx wrangler pages project create dylanla-com --production-branch main
```

Deploy current build:

```bash
npm run deploy:cloudflare
```

The deploy command runs:

1. `npm run build`
2. `wrangler pages deploy dist/public --project-name dylanla-com`
