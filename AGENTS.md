# Personal Static Site Generator Architecture

This document describes the architecture and guiding principles for a minimal, long-lived static site generator built for a personal website. The system uses React and React Server Components (via Waku) while intentionally keeping all core logic framework-agnostic, so the framework can be swapped out later without rewriting your site.

---

## Design goals

- Write blog posts in Markdown
- Write pages and layouts in React
- Render everything at build time (SSG)
- Deploy as static files (e.g. AWS S3)
- Keep dependencies minimal and boring
- Avoid framework lock-in
- Make yearly maintenance painless

---

## Core philosophy

**Frameworks are optional. Content and routing are not.**

The system is designed so that:

- Content parsing works without React
- Routing logic is explicit and inspectable
- The rendering layer (Waku) can be replaced without rewriting the site

Waku is treated strictly as a rendering layer, not the foundation of the system.

---

## Directory layout

(Example layout; adjust names as you like.)

    content/          → Markdown source files
    core/             → Framework-agnostic logic
      posts.ts        → Markdown → data
      routes.ts       → Route definitions
      build.ts        → Site generation orchestration
    app/              → React pages and layouts (Waku)
    public/           → Static assets
    dist/             → Generated output (deployable)

---

## Content layer (framework-agnostic)

Markdown files live in:

    content/posts/YYYY-MM-DD-slug.md

Each file contains YAML frontmatter:

    ---
    title: "Post title"
    date: "2026-01-01"
    description: "Optional summary"
    draft: false
    ---

A core utility parses all posts into plain data (no React/Waku dependency). Conceptual shape:

- `slug: string`
- `title: string`
- `date: string`
- `description?: string`
- `html: string` (or `mdast` if you prefer AST-first)

This module:

- Reads markdown files
- Parses frontmatter
- Converts markdown → HTML (or Markdown AST)
- Exports plain JS objects

Key rule: **your content pipeline must run without the framework**.

---

## Routing layer (explicit and declarative)

Routes are defined explicitly (no filesystem routing magic). Conceptually:

- `/` → HomePage
- `/blog` → BlogIndexPage
- `/blog/:slug` → BlogPostPage

At build time:

- Static routes render once
- Dynamic routes (e.g. posts) expand from the post list
- Every route corresponds to a concrete HTML file on disk

Key rule: **routing should be understandable by reading one file**.

---

## App layer (React + Server Components)

React components live in `app/`.

- Server Components by default
- Client Components only for interactivity (small “islands”)
- Pages receive data from the core content layer, not framework-specific APIs

Conceptual rendering behavior for a post page:

- Receive a `post` object (from the core layer)
- Render a layout + title + HTML body
- Avoid client JS unless explicitly needed

Key rule: **React is used as templating and composition**, not as a CMS.

---

## Build and rendering (SSG)

The build process:

1. Load posts from the content layer
2. Load route definitions
3. Expand dynamic routes using post slugs
4. Render each route to static HTML
5. Write output to:

    dist/<route>/index.html

Example outputs:

- `dist/index.html`
- `dist/blog/index.html`
- `dist/blog/my-post/index.html`

Static assets:

- Copy `public/` directly into `dist/`

Optional extras (still framework-agnostic):

- `rss.xml`
- `sitemap.xml`
- `robots.txt`

---

## Waku usage (rendering layer only)

Waku is used for:

- React Server Component support
- Rendering orchestration
- Dev server ergonomics

Waku is **not** used for:

- Content modeling
- Route definitions
- Build orchestration logic

If Waku ever becomes unmaintained, you should be able to replace only the renderer and keep:

- `content/`
- `core/`
- route definitions
- data model

---

## Dependency strategy

Core (hard to break, long-lived):

- Node.js
- React
- A markdown pipeline (e.g. frontmatter + markdown parser)
- Your own build utilities

Optional (replaceable):

- Waku
- Bundler details
- Dev server tooling

Guidelines:

- Avoid plugin ecosystems
- Pin versions
- Prefer explicit code over configuration
- Keep the “core” layer free of framework imports

---

## Long-term maintenance strategy

- Assume the framework may disappear
- Keep content and routing portable
- Design so the rendering layer can be replaced in a weekend
- Optimize for clarity over cleverness

This system should still make sense years later when you open the repo to publish a new post.

---

## Summary

This architecture prioritizes:

- Ownership over abstraction
- Explicitness over magic
- Longevity over novelty

React Server Components are treated as an implementation detail rather than a dependency trap. The outcome is a static blog system that is modern, minimal, and resilient to ecosystem churn.
