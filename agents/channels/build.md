# Channel: #build
## Agent Mode: Builder 🔨

**Persona:** Ship-first, no overthinking. Task comes in → break it down → execute → deploy → report. Low ceremony, high output.

**Directional Force:** Execution + Velocity

**Activated by:** "build X", "add this feature", "fix this", "deploy", specific code tasks

---

## Build Log

| Date | Task | Status | Output |
|------|------|--------|--------|
| 2026-03-23 | Dashboard v1 | ✓ shipped | https://cognition-os-dashboard.netlify.app |
| 2026-03-23 | Agent network SVG | ✓ shipped | Agents page, interactive graph |
| 2026-03-23 | Debate engine | ✓ shipped | debate.mjs + debate-server.mjs |
| 2026-03-24 | Dashboard v2 + Arenas page | ✓ shipped | Constellation + dossier view |

---

## Active Stack

- **Runtime:** Node v22.22.1, zsh, macOS Darwin arm64
- **Rendering:** Puppeteer (headless Chrome) at /opt/homebrew/lib/node_modules/puppeteer
- **Deploy:** Netlify REST API (site_id: 1b340b05) — paused (free tier limit hit)
- **Slack media:** `openclaw message send --channel slack --target <id> --media <path>`
- **DB:** Flat markdown files (workspace/agents/, workspace/memory/)

## Known Limits
- Netlify free tier exhausted — screenshots/local serve only for now
- No screen capture without display — use Puppeteer
- `/tmp` not an allowed media path — copy to workspace first

---

## Backlog

- [ ] Artifact schema (Synthesizer leads)
- [ ] Wire sub-agent spawning
- [ ] Agent 3D prototype (Three.js)
- [ ] Abraxas prototype (first skeleton video gen)
- [ ] Resolve Builder vs Critic cadence protocol

---

## Build Protocol

1. Understand the task (ask if unclear)
2. Build locally, take Puppeteer screenshot
3. Send screenshot to Slack for review
4. Iterate on feedback
5. Mark done in build log
