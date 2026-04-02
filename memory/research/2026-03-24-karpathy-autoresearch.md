# Research: Karpathy AutoResearch
*Researched: 2026-03-24 by Scout*

## Summary
AutoResearch is a **real, open-source project** released by Andrej Karpathy on March 7–8, 2026. 630 lines of Python. Creates an autonomous ML research loop: AI agent modifies a training script → runs 5-minute GPU experiments → keeps changes that improve validation loss → repeats indefinitely. In Karpathy's own test: 700 experiments over 2 days, 20 genuine improvements, 11% efficiency gain on code he'd hand-optimized for years. Went viral with 8.6M+ views.

## Key Findings

**Repo:** `github.com/karpathy/autoresearch` — MIT License

**How it works:**
1. Human writes research goals in `program.md` (markdown instructions)
2. Agent reads → forms hypothesis → edits `train.py`
3. Fixed 5-minute training run executes
4. If `val_bpb` improves → commit to git. If not → discard.
5. Agent loops. "Do NOT pause to ask the human if you should continue."

**Real results:**
- Karpathy: 700 experiments, 20 improvements, loss 0.9979 → 0.9697, 11% efficiency gain
- Shopify CEO Tobi Lütke: 37 experiments, 19% validation improvement, 8 hours, zero human input
- Hyperspace AI: Distributed across 35 P2P nodes overnight
- Agent caught bugs Karpathy had missed: attention scaling, missing Value Embedding regularization, wrong AdamW betas

**The pattern:**
- goal + single editable file + measurable metric + loop = autoresearch for anything
- Generalizes beyond ML: landing pages, pricing, prompt templates, code quality
- Built on `nanochat` (his broader LLM training framework)
- Requires: single NVIDIA GPU (tested on H100), Python 3.10+, `uv`

**Karpathy's framing:** "You don't 'use it' directly — it's a recipe/idea. Give it to your agent and apply to what you care about."

## Open Questions
- Can the pattern generalize to non-ML iteration problems?
- Works on consumer GPUs (4090)?
- What's the best `program.md` template for non-ML use cases?

## Next Actions
1. Read README at `github.com/karpathy/autoresearch`
2. Read Karpathy's tweets: `2030371219518931079`, `2031135152349524125`
3. Think about: what would Thomas's autoresearch loop look like? What's the metric, what's the file, what's the goal?
4. Practical setup guide: nicholasrhodes.substack.com
