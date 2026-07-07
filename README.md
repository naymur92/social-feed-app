# Social Feed (Full Stack Application)

Live: <https://social-feed.naymur.dev> · API: <https://cdn.social-feed.naymur.dev> · Video: <https://youtube.com>

## Demo accounts

- naymur@example.com / password (has private post)
- kamrul@example.com / password

## Stack

Next.js 14 (App Router) · Laravel 11 + Sanctum tokens · MySQL

## Architecture decisions

- **Envelope responses** `{flag, msg, data, response_code}` via jsonResponse() helper
- **Hashid public IDs** — sequential integers never exposed
- **Polymorphic likes** — one table for posts/comments/replies; uniqueness
  enforced at DB level (unique constraint), reaction-type column ready
- **Cursor pagination** (feed + comments) — constant-time pages at millions of rows,
  vs offset scan-and-discard
- **N+1-free like state** — withExists subquery computes liked_by_me inside
  the feed query; withCount for totals
- **Visibility authorization centralized** in base controller; enforced on posts,
  comments, likes, likers. 404 over 403 — don't reveal private posts exist
- **Comments = one table** — replies via parent_id, one nesting level (per design),
  replies to replies re-parent (Instagram model)
- **Images normalized** to post_images — multi-image without schema change

## Security

Sanctum tokens · Form Request validation everywhere · rate limiting (login 5/min,
API 60/min) · image mime/size/count limits, content-verified · mass-assignment
guarded · React XSS escaping · IDOR-tested private post access

## Run locally

[backend: composer install, .env, storage permission, migrate --seed, serve · frontend: npm i, .env.local, npm run dev]

## Schema

[5 tables: users, posts, post_images, comments (self-ref), likes (polymorphic) — diagram or bullet list]
