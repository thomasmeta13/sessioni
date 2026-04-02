/**
 * Cognition OS — Agent Debate Engine
 * Usage: node debate.mjs "<motion>" [channel_id]
 *
 * Spawns 3 debater personas + 1 judge via sub-agents,
 * posts each turn as a threaded Slack conversation.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const MOTION = process.argv[2];
const CHANNEL = process.argv[3] || 'C0AP8171F16';

if (!MOTION) {
  console.error('Usage: node debate.mjs "<motion>" [channel_id]');
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function send(msg, replyTo = null) {
  const replyFlag = replyTo ? `--reply-to "${replyTo}"` : '';
  const escaped = msg.replace(/"/g, '\\"').replace(/`/g, '\\`');
  const result = execSync(
    `openclaw message send --channel slack --target ${CHANNEL} ${replyFlag} --message "${escaped}"`,
    { encoding: 'utf8' }
  );
  const match = result.match(/Message ID: ([^\s]+)/);
  return match ? match[1] : null;
}

function askAgent(systemPrompt, userPrompt) {
  const fullPrompt = `[SYSTEM: ${systemPrompt}]\n\n${userPrompt}`;
  // Write to temp file to avoid shell escaping issues
  const tmpFile = `/tmp/debate_prompt_${Date.now()}.txt`;
  writeFileSync(tmpFile, fullPrompt);
  try {
    const result = execSync(
      `openclaw agent --agent main -m "$(cat ${tmpFile})"`,
      { encoding: 'utf8', timeout: 90000, shell: '/bin/zsh' }
    ).trim();
    return result || '(no response)';
  } finally {
    execSync(`rm -f ${tmpFile}`);
  }
}

// ── Persona definitions ─────────────────────────────────────────────────────
const PERSONAS = [
  {
    id: 'visionary',
    name: 'Visionary',
    emoji: '🌟',
    icon: ':star:',
    role: 'You argue for ambitious, forward-thinking approaches. You believe in building for the future, not the present. You are optimistic, bold, and energetic. Keep it punchy — 3-4 sentences max.',
  },
  {
    id: 'pragmatist',
    name: 'Pragmatist',
    emoji: '🔧',
    icon: ':wrench:',
    role: 'You argue for practical, shipping-focused approaches. You care about what works today, not theoretical perfection. You are direct, grounded, and skeptical of over-engineering. 3-4 sentences max.',
  },
  {
    id: 'critic',
    name: 'Critic',
    emoji: '⚡',
    icon: ':zap:',
    role: 'You identify flaws, risks, and overlooked assumptions in both other positions. You are adversarial but constructive. You do not take a side — you challenge both. 3-4 sentences max.',
  },
];

const JUDGE = {
  name: 'Judge',
  emoji: '⚖️',
  role: 'You are an impartial judge. Given a debate motion and three arguments (Visionary, Pragmatist, Critic), you must: 1) Pick a winner and explain why in 2 sentences. 2) Give the key insight from each debater in 1 sentence each. 3) State the final verdict in one bold sentence.',
};

// ── Main ────────────────────────────────────────────────────────────────────
async function runDebate() {
  console.log(`Starting debate: "${MOTION}"`);

  // Opening post
  const rootTs = send(
    `⚖️ *Agent Debate* — Thread\n\n*Motion:* _"${MOTION}"_\n\n` +
    `Three agents will now argue their positions. Judge rules at the end.\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━`
  );
  if (!rootTs) { console.error('Failed to post root message'); process.exit(1); }
  console.log('Root thread:', rootTs);

  // Each persona argues
  const args = {};
  for (const p of PERSONAS) {
    console.log(`Generating ${p.name} argument...`);
    const argument = askAgent(
      p.role,
      `Motion to argue: "${MOTION}"\n\nGive your position. Be direct and specific. No preamble.`
    );
    args[p.id] = argument;

    send(
      `${p.emoji} *${p.name}*\n\n${argument}`,
      rootTs
    );
    console.log(`${p.name} posted.`);
    // Small delay to keep ordering clear
    execSync('sleep 1');
  }

  // Critic gets to see Visionary and Pragmatist first
  console.log('Generating Judge verdict...');
  const judgeInput =
    `Motion: "${MOTION}"\n\n` +
    `VISIONARY argued: ${args.visionary}\n\n` +
    `PRAGMATIST argued: ${args.pragmatist}\n\n` +
    `CRITIC argued: ${args.critic}\n\n` +
    `Now deliver your verdict.`;

  const verdict = askAgent(JUDGE.role, judgeInput);

  send(
    `${JUDGE.emoji} *Judge's Verdict*\n\n${verdict}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Debate archived. React to this message to flag for review._`,
    rootTs
  );

  // Save transcript
  const transcriptDir = '/Users/openclaudio/.openclaw/workspace/debates';
  if (!existsSync(transcriptDir)) mkdirSync(transcriptDir, { recursive: true });
  const slug = MOTION.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const transcript = {
    motion: MOTION,
    timestamp: new Date().toISOString(),
    channel: CHANNEL,
    thread_ts: rootTs,
    arguments: PERSONAS.map(p => ({ persona: p.name, argument: args[p.id] })),
    verdict,
  };
  const path = `${transcriptDir}/${ts}-${slug}.json`;
  writeFileSync(path, JSON.stringify(transcript, null, 2));
  console.log(`Transcript saved: ${path}`);
  console.log('Debate complete.');
}

runDebate().catch(e => { console.error(e); process.exit(1); });
