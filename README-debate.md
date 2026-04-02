# Agent Debate Engine

Run a debate between Visionary, Pragmatist, Critic + Judge — posts as a Slack thread.

## Usage

```bash
cd ~/.openclaw/workspace
node debate.mjs "your motion here" [slack_channel_id]
```

## Examples

```bash
node debate.mjs "We should use a database instead of flat files for agent memory"
node debate.mjs "Ship the MVP now vs. wait for the agent schema to stabilize"
node debate.mjs "The economic confidence layer should be built before the arena"
```

## What it does

1. Posts a root message in the channel
2. Visionary argues their position (in thread)
3. Pragmatist argues their position (in thread)
4. Critic challenges both (in thread)
5. Judge picks a winner + explains why (in thread)
6. Full transcript saved to `debates/` folder as JSON

## Transcripts

All debates saved to `~/.openclaw/workspace/debates/*.json`
Contains: motion, all arguments, verdict, thread_ts for Slack lookup.

## Personas

- 🌟 **Visionary** — ambitious, forward-looking, bold
- 🔧 **Pragmatist** — ship-focused, practical, skeptical of over-engineering  
- ⚡ **Critic** — adversarial, finds flaws in both sides
- ⚖️ **Judge** — impartial, picks winner with reasoning
