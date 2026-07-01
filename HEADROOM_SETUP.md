# Headroom — cut chat token costs

The on-site AI chat widget (`/api/chat`) can route its LLM calls through
[Headroom](https://github.com/headroomlabs-ai/headroom), an open-source
compression proxy that reduces token usage **60–95%** before requests reach
DeepSeek/Claude — lowering cost with no quality loss and no app code changes.

## How it's wired
The chat route reads its LLM base URLs from env vars and defaults to the
providers directly, so it works unchanged until you opt in:

| Env var | What it does |
|---|---|
| `HEADROOM_PROXY_URL` | OpenAI-compatible base for the DeepSeek call — set to your Headroom proxy (e.g. `https://your-proxy/v1`). Primary knob. |
| `NVIDIA_BASE_URL` | Alternate OpenAI-compatible base if you're not using Headroom. |
| `ANTHROPIC_BASE_URL` | Optionally route the Claude backup through Headroom too. |

Priority for the DeepSeek call: `HEADROOM_PROXY_URL` → `NVIDIA_BASE_URL` →
NVIDIA direct.

## Setup (proxy runs on your own host, not on Vercel)
Headroom is Python/Rust, so it can't run inside Vercel's serverless functions —
run it as a small always-on service (a $5 VPS, Fly.io, Railway, or a container)
and point the site at it.

1. **Install & run the proxy** on your host:
   ```bash
   pip install "headroom-ai[all]"            # Python 3.10+
   # Configure the upstream to NVIDIA's OpenAI-compatible API + your NVIDIA key,
   # then start the proxy (see Headroom docs for provider config):
   headroom proxy --port 8787
   ```
2. **Expose it over HTTPS** (reverse proxy / the platform's URL), e.g.
   `https://headroom.yourdomain.com`.
3. **In Vercel** → getvertex → Settings → Environment Variables, set:
   - `HEADROOM_PROXY_URL = https://headroom.yourdomain.com/v1`
   - keep `NVIDIA_API_KEY` set (the app still sends the bearer token; Headroom
     forwards it to NVIDIA)
   Then redeploy.
4. **Verify**: chat as usual, then check Headroom's dashboard
   (`headroom dashboard`) for the token savings.

## Notes
- If the proxy is down or misconfigured, the chat route's error handling falls
  back to Claude, then to scripted replies — the widget never breaks.
- Only the model call is proxied; no visitor data is stored by the app beyond
  what already flows to the LLM provider.
