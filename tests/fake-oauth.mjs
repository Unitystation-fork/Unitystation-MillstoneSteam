// Faux serveur Discord/Twitch pour les tests (port 4500, aucun appel réseau réel).
import http from "node:http";

const PORT = Number(process.env.FAKE_OAUTH_PORT || 4500);
const DISCORD = { id: "fake-discord-id", secret: "fake-discord-secret", redirect: "http://127.0.0.1:3000/?service=discord" };
const TWITCH = { id: "fake-twitch-id", secret: "fake-twitch-secret", redirect: "http://127.0.0.1:3000/?service=twitch" };
const CODES = {
  "good-code": { token: "tok:alice", ...DISCORD },
  "unknown-user": { token: "tok:zed", ...DISCORD },
  "admin-discord": { token: "tok:admin", ...DISCORD },
  "html-discord": { html: true, ...DISCORD },
  "good-twitch": { token: "tok:bob", ...TWITCH },
  "admin-twitch": { token: "tok:admin", ...TWITCH },
  "html-twitch": { html: true, ...TWITCH },
};

const send = (res, status, obj) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    if (req.method === "POST" && url.pathname === "/oauth2/token") {
      const p = new URLSearchParams(raw);
      console.log(`token code=${p.get("code")} redirect_uri=${p.get("redirect_uri")}`);
      const entry = CODES[p.get("code")];
      if (
        !entry ||
        p.get("client_secret") !== entry.secret ||
        p.get("client_id") !== entry.id ||
        p.get("redirect_uri") !== entry.redirect
      ) {
        return send(res, 400, { error: "invalid_grant" });
      }
      if (entry.html) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end("<html><body>Maintenance</body></html>");
      }
      return send(res, 200, { access_token: entry.token, token_type: "Bearer" });
    }
    const bearer = (req.headers.authorization || "").replace(/^Bearer /, "");
    const name = bearer.startsWith("tok:") ? bearer.slice(4) : null;
    if (req.method === "GET" && url.pathname === "/users/@me") {
      if (!name) return send(res, 401, { message: "401: Unauthorized" });
      return send(res, 200, { id: "1", username: name });
    }
    if (req.method === "GET" && url.pathname === "/helix/users") {
      if (!name || req.headers["client-id"] !== TWITCH.id) return send(res, 401, { error: "Unauthorized" });
      return send(res, 200, { data: [{ login: name }] });
    }
    send(res, 404, { error: "not found" });
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`fake oauth sur ${PORT}`));
