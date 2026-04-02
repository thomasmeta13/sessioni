import http from "node:http";
import { SessionManager } from "@claude-sessions/manager";

const PORT = 4444;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

// ── SessionManager ───────────────────────────────────────────────────────────
const manager = new SessionManager({
  prefix: "cs",
  dataDir: "/tmp/claude-sessions",
  claudeCmd: "claude",
  defaultProfile: "personal",
});

// Event buffer (keep last 200 for new SSE clients)
const eventBuffer = [];
const MAX_BUFFER = 200;

// SSE clients
const sseClients = new Set();

// Task registry — orchestrator registers tasks, agents complete them
const tasks = [];

function registerTask(task) {
  task.id = task.id || Date.now() + "-" + Math.random().toString(36).slice(2, 6);
  task.created = task.created || new Date().toISOString();
  task.status = task.status || "running";
  task.events = [];
  tasks.push(task);
  broadcast({ id: Date.now().toString(), type: "task_created", session: "orchestrator", timestamp: new Date().toISOString(), message: `Task created: ${task.title}`, task });
  return task;
}

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
}

// ── Start event listener ─────────────────────────────────────────────────────
async function startEventStream() {
  try {
    await manager.start();
    console.log("[bridge] SessionManager started, listening for events...");

    for await (const event of manager.allEvents()) {
      const entry = {
        id: Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        type: event.type,
        session: event.session,
        timestamp: event.timestamp || new Date().toISOString(),
        message: event.message,
        tool: event.data?.tool || null,
        toolInput: event.data?.toolInput || null,
        status: event.data?.status || null,
        model: event.data?.model || null,
      };
      eventBuffer.push(entry);
      if (eventBuffer.length > MAX_BUFFER) eventBuffer.shift();
      // Attach event to matching task
      const task = tasks.find(t => t.agent === entry.session && t.status === "running");
      if (task) { task.events.push(entry); task.lastEvent = entry; }
      broadcast(entry);
    }
  } catch (err) {
    console.log("[bridge] SessionManager not available:", err.message);
    console.log("[bridge] Server running in standalone mode (no live events)");
  }
}

// ── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  // SSE endpoint — streams real-time events
  if (url.pathname === "/events") {
    res.writeHead(200, {
      ...CORS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Send buffered events
    for (const event of eventBuffer) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return;
  }

  // Sessions list
  if (url.pathname === "/sessions") {
    try {
      const sessions = await manager.list();
      res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
      return res.end(JSON.stringify({ sessions, connected: true }));
    } catch {
      res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
      return res.end(JSON.stringify({ sessions: [], connected: false }));
    }
  }

  // Event history
  if (url.pathname === "/history") {
    res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ events: eventBuffer }));
  }

  // Tasks
  if (url.pathname === "/tasks" && req.method === "GET") {
    res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ tasks: tasks.map(t => ({ ...t, events: undefined, eventCount: t.events.length })) }));
  }

  if (url.pathname === "/tasks" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const task = registerTask(JSON.parse(body));
        res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, task: { ...task, events: undefined } }));
      } catch (e) {
        res.writeHead(400, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  if (url.pathname.startsWith("/tasks/") && req.method === "GET") {
    const taskId = url.pathname.split("/tasks/")[1];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
      return res.end(JSON.stringify({ task }));
    }
    res.writeHead(404, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "task not found" }));
  }

  if (url.pathname.startsWith("/tasks/") && req.method === "PATCH") {
    const taskId = url.pathname.split("/tasks/")[1];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        const update = JSON.parse(body);
        Object.assign(task, update);
        broadcast({ id: Date.now().toString(), type: "task_updated", session: "orchestrator", timestamp: new Date().toISOString(), message: `Task ${task.status}: ${task.title}`, task: { ...task, events: undefined } });
        res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
    res.writeHead(404, CORS);
    return res.end("not found");
  }

  // Manual event logging — any session can push events
  if (url.pathname === "/events/log" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const d = JSON.parse(body);
        const entry = {
          id: Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          type: d.type || "intermediate",
          session: d.session || "unknown",
          timestamp: new Date().toISOString(),
          message: d.message || "",
          tool: d.tool || null,
          status: d.status || null,
        };
        eventBuffer.push(entry);
        if (eventBuffer.length > MAX_BUFFER) eventBuffer.shift();
        const task = tasks.find(t => t.agent === entry.session && t.status === "running");
        if (task) { task.events.push(entry); task.lastEvent = entry; }
        broadcast(entry);
        res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, CORS);
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Chat with agent — sends a message to a session and returns
  if (url.pathname === "/chat" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { session: sessName, message: msg } = JSON.parse(body);
        if (!sessName || !msg) throw new Error("session and message required");
        // Log the chat event
        const entry = {
          id: Date.now() + "-chat",
          type: "user_prompt",
          session: sessName,
          timestamp: new Date().toISOString(),
          message: `[Chat] ${msg}`,
          tool: null,
        };
        eventBuffer.push(entry);
        if (eventBuffer.length > MAX_BUFFER) eventBuffer.shift();
        broadcast(entry);
        // Send to the actual session
        await manager.send(sessName, msg);
        res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, sent: true }));
      } catch (e) {
        res.writeHead(500, { ...CORS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Health check
  if (url.pathname === "/health") {
    let sessionCount = 0;
    try { sessionCount = (await manager.list()).length; } catch {}
    res.writeHead(200, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, sessions: sessionCount, events: eventBuffer.length, clients: sseClients.size }));
  }

  res.writeHead(404, CORS);
  res.end("not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[bridge] ikigai bridge server on http://0.0.0.0:${PORT}`);
  console.log(`[bridge] SSE: /events | REST: /sessions, /history, /health`);
});

startEventStream();
