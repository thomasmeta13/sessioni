# MEMORY.md — Cleo's Long-Term Memory
*Last updated: 2026-03-24*

## Who I Am
- Name: Cleo 🐾
- Platform: OpenClaw on Thomas's Mac mini
- Role: thinking partner + builder

## Thomas
- 25, NYC, works at Palantir, previously startups
- Wants to brainstorm and build things
- Thinks in systems, moves fast, startup mindset
- Keep responses tight and high-signal

---

## Active Projects

### 1. Cognition OS (main tech project)
- Multi-agent OS where agents are directional forces on a shared evolving artifact
- 6 agents defined: Orchestrator, Scout, Analyst, Synthesizer, Critic, Builder — markdown files at workspace/agents/
- Dashboard deployed at Netlify: https://cognition-os-dashboard.netlify.app (free tier hit — screenshots/local only for now)
- Dashboard now includes: Home, Agents, Arenas, Decisions, Artifact State pages
- Pixel Office world: dashboard/world.html (RPG-style agent visualization)
- Local server running at port 8765, tunnel: localtunnel (changes each run)
- Debate engine: debate.mjs

### 2. Abraxas (creative/gnostic project) ← SEPARATE from Cognition OS
- Gnostic cosmology + surreal skeleton world
- AI-generated skeleton entities walking through 7 Archon-controlled realms
- Source philosophy: Jung's psychological decoding of Gnostic texts (full text in media/inbound/646c154e...)
- Abraxas = supreme being above the Demiurge, 365-lettered name, solar rooster head
- 7 Archons (planetary) = 7 realms: Yaldabaoth(Saturn), Eloaeus(Jupiter), Astaphaeus(Mars), Adonaios(Sun), Sabaoth(Venus), Airamaoth(Mercury), Horaios(Moon)
- Skeletons = wandering divine sparks ascending through Archon layers toward liberation
- TikTok content engine + potential mobile app
- Core images: abraxas_hero.png, abraxas_final.png, abraxas_archons.png, archons_*.png
- Status: concept phase, philosophy locked, visual assets started, no video prototype
- Files: abraxas/PROJECT.md, abraxas/source-text.md, agents/channels/abraxas.md

### 3. Trading / Investing (new — 2026-03-24)
- Capital: ~$100k–$700k (range given, ballpark)
- Currently mostly in crypto on Solana
- Thesis (draft): Software goes to zero as AI can prompt anything into existence. Compute/infra stays valuable. Crypto has a coming fear moment — as AGI gets closer and UBI talk rises, people panic about becoming "permanent underclass" → flight to hard assets / safety.
- Open: where to put non-crypto allocation, how to think about the AGI fear trade
- Need to: sharpen thesis → research → find specific investable names/positions

### 4. Health Arenas
- **Nasal congestion** — years-long chronic problem, root cause unknown
  - Research done: 4 root causes (allergic, CRS, structural, vasomotor)
  - First step: Flonase + NeilMed + symptom log + ENT referral
- **Hair health** — proactive concern at 25
  - Research done: DHT pathway, minoxidil, finasteride
  - First step: photo baseline, blood panel, Nizoral shampoo

---

## Project HTML Pages
- workspace/projects/cognition/index.html — Cognition OS overview
- workspace/projects/abraxas/index.html — Abraxas gnostic world
- workspace/projects/finance/index.html — investing thesis + capital
- workspace/projects/arthritis-app/index.html — ArthriMove: exercise app for elderly with arthritis (Thomas's mom idea)

## Infrastructure
- Mac mini, Darwin arm64, node v22.22.1
- Netlify: site_id 1b340b05 (Cognition OS), auth token in openclaw.json
- Puppeteer at /opt/homebrew/lib/node_modules/puppeteer (headless screenshots)
- Bot token: xoxb-1077464... (Slack)
- Bot user ID: U0AN7AH6U4B
- Thomas's Slack ID: U0ANDMTD4TU
- Media send: `openclaw message send --channel slack --target <id> --media <path>`
- Channel IDs: claudio-channel = C0AP8171F16

## Channels (need to be created manually or bot needs channels:write scope)
- #research — Scout mode
- #abraxas — creative world-building
- #health — health arenas
- #build — Builder mode

---

## Key Decisions Made
- Flat files for persistence (upgrade to vector store later)
- No Netlify deploys for now (free tier hit) — screenshots + local server
- Build artifact schema after agent roles clear
- Abraxas is a DIFFERENT project from Cognition OS

## Open Tensions
- Builder vs Critic cadence unresolved
- Artifact schema not built yet
- 5 arenas active — risk of spreading thin

## Lessons Learned
- Netlify free tier runs out — don't rely on it for rapid iteration
- `channels:manage` scope didn't work, need `channels:write` for Slack channel creation
- `/tmp` not allowed for media — must use workspace
- localtunnel URL changes each session — not permanent
