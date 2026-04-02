# Research: Agent Visualizers (2025–2026)
*Researched: 2026-03-24 by Scout*

## Summary
The field splits into two tracks: **observability/tracing tools** (LangSmith, AgentOps, Langfuse) for debugging production agents, and **spatial/simulation environments** (Generative Agents) for research and storytelling. OpenClaw has no dedicated visual layer — it's chat-first. The canonical reference for "Habbo-style agents in space" is Stanford's Generative Agents (2023), still not commercially productized. The space is wide open.

## Key Findings

### OpenClaw
- Chat/CLI-first platform. No visual agent dashboard found. Gap exists between what it does and what it shows visually.

### Habbo/Sims-style agent worlds
- **Stanford Generative Agents** (Park et al., 2023) — `joonspk-research/generative_agents` — 25 LLM agents in a 2D Phaser.js tile-map town ("Smallville"). Emergent social behavior. Still the canonical reference in 2026.
- No commercial "Habbo for AI agents" product exists yet.

### Observability Tools
- **AgentOps** (agentops.ai) — best production tool. Event traces, "Time Travel Debugging", 400+ integrations. Free up to 5k events.
- **LangSmith** — graph-based trace visualization, LangChain-native
- **Langfuse** — open-source, self-hostable equivalent

### WebGL / Rendering Options
- **Three.js** — most popular, full control, large ecosystem
- **Babylon.js** — Microsoft-backed, game-engine-like, built-in physics
- **Phaser.js** — 2D tile-based (used by Generative Agents). Best for Habbo-style.
- **React Flow / D3** — graph/pipeline visualization (less spatial)

### Recent Landscape
- No breakout "viral 3D agent world" product as of March 2026. Ripe for building.
- Karpathy autoresearch has a `progress.png` chart output — not a spatial world.

## Open Questions
- Is anyone building "Habbo for AI agents" in stealth?
- Best architecture: server-side agent logic + WebSocket → frontend renderer?
- Post-Generative-Agents open-source projects?

## Next Actions
1. Look at AgentOps baseline (agentops.ai)
2. Clone `joonspk-research/generative_agents` and run Smallville locally
3. Build with Phaser.js (2D) or Three.js (3D) + WebSocket bridge to agent events
4. Check X/Twitter for recent demos — moves faster than search
