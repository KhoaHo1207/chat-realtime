# Chat Realtime

Secure, self-destructing chat rooms built with Next.js, Elysia, and Upstash.

## Architecture

- **Next.js App Router** renders the landing page (`/`) and the gated room view (`/room/[roomId]`).
- **Elysia API routes** (`app/api/[[...slugs]]/route.ts`) serve room lifecycle (`/room/create`, `/room/ttl`, `/room`, `/room` delete action) and message history under `/messages`.
- **Upstash Redis & Realtime** store `meta:<roomId>` hashes, `messages:<roomId>` lists, and stream `chat.message` + `chat.destroy` events to connected browsers.
- **Proxy middleware** enforces the two-user limit, issues `x-auth-token` cookies, and redirects invalid or expired rooms back to `/?error=room-not-found`.
- **React Query + Realtime client** keep the message list in sync and drive the self-destruct countdown via `/room/ttl`.

## Key flows

1. Create a room on the home page; the API seeds Redis, returns the room ID, and redirects the client into a protected `/room/<id>` view.
2. The proxy checks `meta:<roomId>` for connected tokens and issues `x-auth-token` cookies (two per room max).
3. The room page polls `/messages` and listens to Upstash realtime events so every participant sees new messages instantly.
4. TTL data is read from `/room/ttl`; the countdown header and background interval honor that TTL and automatically redirect when it hits zero or when the `chat.destroy` event fires.

## Environment

Set the Upstash credentials before running locally or on hosting:

```env
UPSTASH_REDIS_REST_URL="https://<your-instance>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<your-token>"
```

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and interact with the UI. Use `npm run lint` to validate TypeScript/React rules.

## Deployment notes

- Build with `npm run build` and serve via `npm run start`.
- Ensure the Upstash URL + token are configured as secrets in your deployment environment; both HTTP and realtime endpoints rely on the same client.
- Keep Redis keys expiring (`ROOM_TTL_SECONDS = 600`) so rooms self-destruct roughly every ten minutes.

## Testing

- `npm run lint` enforces ESLint/TypeScript while the app currently lacks automated unit tests.
- Monitor Redis keys (`meta:<roomId>`, `messages:<roomId>`) through the Upstash dashboard if you need to inspect TTLs or message history.

## Stack

- **Next.js 16.1.6** (App Router, React 19)
- **Elysia + Eden/Treaty** for typed API and client bindings
- **Upstash Redis + Realtime** for messaging/publish-subscribe
- **Tailwind CSS v4** via PostCSS
