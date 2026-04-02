/**
 * Debate Slash Command Shim
 * - Receives /debate from Slack
 * - Immediately acks (200 + "Starting debate...")
 * - Fires off debate.mjs async in background
 */

import http from 'http';
import { execSync, spawn } from 'child_process';
import { URLSearchParams } from 'url';

const PORT = 4242;
const WORKSPACE = '/Users/openclaudio/.openclaw/workspace';

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(Object.fromEntries(new URLSearchParams(body))); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }

  const body = await parseBody(req);
  const command = body.command || '';
  const text = (body.text || '').trim();
  const channelId = body.channel_id || 'C0AP8171F16';
  const responseUrl = body.response_url;
  const userName = body.user_name || 'someone';

  console.log(`[${command}] from ${userName}: "${text}" in ${channelId}`);

  if (command === '/debate') {
    if (!text) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        response_type: 'ephemeral',
        text: '⚠️ Usage: `/debate <motion>` — e.g. `/debate should we build the schema first?`'
      }));
      return;
    }

    // Immediate ack — Slack needs this within 3s
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      response_type: 'in_channel',
      text: `⚖️ *Debate incoming…*\n_Motion: "${text}"_\nAgents are assembling. Thread coming up shortly.`
    }));

    // Fire debate async — don't await
    const child = spawn(
      'node',
      [`${WORKSPACE}/debate.mjs`, text, channelId],
      { detached: true, stdio: 'ignore', cwd: WORKSPACE }
    );
    child.unref();
    console.log(`Debate spawned (pid ${child.pid}): "${text}"`);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Debate shim listening on http://127.0.0.1:${PORT}`);
});
