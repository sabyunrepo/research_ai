# Lecture Cuts Cloudflare Audience Hosting

## Goal

Expose only the attendee review surface through Cloudflare Tunnel.

- Public: `audience.html`, `/api/audience/*`, `assets/style.css`, `assets/audience.js`, and slide images.
- Private/local only: `deck.html`, `speaker.html`, `presenter-review.html`, raw slide HTML, `assets/slides.js`, and presenter scripts/cues.

## Local Server

Run one local server. The stage, speaker console, and audience page share the same in-memory presentation state.

```sh
node scripts/serve-lecture-cuts-review.js --port 8777
```

Or run the same server through Docker:

```sh
docker compose up --build lecture-cuts
```

Local-only pages:

- `http://127.0.0.1:8777/deck.html`
- `http://127.0.0.1:8777/speaker.html`

Audience page:

- `http://127.0.0.1:8777/audience.html`

## Cloudflare Tunnel Setup

Install `cloudflared` first if missing:

```sh
brew install cloudflared
```

Authenticate and create a named tunnel:

```sh
cloudflared tunnel login
cloudflared tunnel create lecture-cuts-audience
```

Create DNS for the hostname:

```sh
cloudflared tunnel route dns lecture-cuts-audience audience.example.com
```

Create `~/.cloudflared/lecture-cuts-audience.yml`:

```yaml
tunnel: lecture-cuts-audience
credentials-file: /Users/sabyun/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: audience.example.com
    service: http://127.0.0.1:8777
  - service: http_status:404
```

Run it:

```sh
cloudflared tunnel --config ~/.cloudflared/lecture-cuts-audience.yml run lecture-cuts-audience
```

Replace `audience.example.com` and `<TUNNEL_ID>` with the real values from `cloudflared tunnel create`.

## Docker + Cloudflare Tunnel

For a remotely managed Cloudflare Tunnel, create a tunnel in the Cloudflare dashboard and set its public hostname to the Docker service:

```text
Public hostname: audience.example.com
Service: http://lecture-cuts:8777
```

Then run both containers:

```sh
cp .env.example .env
# Edit .env and set CLOUDFLARE_TUNNEL_TOKEN to the real Cloudflare tunnel token.
docker compose --profile tunnel up --build
```

The compose file publishes the lecture app only to local loopback:

```text
127.0.0.1:8777 -> lecture-cuts:8777
```

So local presenter URLs remain available on this Mac, while the Cloudflare container reaches the app over the internal Docker network.

## Why The Same Local Server Is Safe

Cloudflare forwards public requests with Cloudflare headers such as `cf-ray` or `cf-connecting-ip`.
`scripts/serve-lecture-cuts-review.js` treats those as public-audience requests and only allows the audience routes/assets.

Expected public behavior:

- `https://audience.example.com/audience.html` -> 200
- `https://audience.example.com/api/audience/slides` -> 200
- `https://audience.example.com/api/audience/slide/0` -> 200 after slide 0 is reached
- `https://audience.example.com/deck.html` -> 404
- `https://audience.example.com/speaker.html` -> 404
- `https://audience.example.com/presenter-review.html` -> 404
- `https://audience.example.com/assets/slides.js` -> 404
- Future unreached slides under `/api/audience/slide/:index` -> 403

## Smoke Checks

```sh
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/audience.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/deck.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/speaker.html
curl -I -H 'cf-ray: smoke' http://127.0.0.1:8777/assets/slides.js
```
