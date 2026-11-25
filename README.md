# lavish-site

My personal site. Next.js 16 (App Router), deployed on Vercel.

```sh
nvm use        # Node 26
npm install
npm run dev
```

- All copy and data live in `content/site.ts`.
- Posts are Markdown files in `content/posts/`, listed in `content/posts.json`.
- Photos: drop `me`, `run`, `gym` or `setup` (`.jpg`/`.png`/`.webp`) into `public/photos/`. Missing ones are skipped at build time.
- `/llms.txt` is generated from the same content, for agents.
- `/api/ping` returns the serving region; the footer and the limiter on `/work/rate-limiter` call it.
