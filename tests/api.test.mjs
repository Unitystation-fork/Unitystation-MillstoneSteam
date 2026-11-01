import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

const post = async (path, body) => {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { http: res.status, json };
};
// h3 renvoie le statut dans le JSON (statusCode) ; l'API historique renvoie 200 HTTP + statusCode dans le corps.
const code = (r) => r.json.statusCode ?? r.http;

test("login admin avec bon mot de passe", async () => {
  const r = await post("/api/login", { name: "admin", password: "secret123" });
  assert.equal(code(r), 200);
  assert.equal(r.json.body.token.split(".").length, 3);
  assert.equal(r.json.body.role, "ADMIN");
});

test("login admin avec mauvais mot de passe", async () => {
  const r = await post("/api/login", { name: "admin", password: "faux" });
  assert.equal(code(r), 401);
  assert.equal(r.json.body?.token, undefined);
});

test("login admin sans mot de passe refusé", async () => {
  const r = await post("/api/login", { name: "admin" });
  assert.equal(code(r), 400);
  assert.equal(r.json.body?.token, undefined);
});

test("login d'un compte tiers sans mot de passe refusé", async () => {
  const r = await post("/api/login", { name: "alice" });
  assert.equal(code(r), 400);
  assert.equal(r.json.body?.token, undefined);
});

test("login d'un compte tiers avec un mot de passe quelconque refusé", async () => {
  const r = await post("/api/login", { name: "alice", password: "x" });
  assert.equal(code(r), 401);
  assert.equal(r.json.body?.token, undefined);
});

test("login utilisateur inconnu", async () => {
  const r = await post("/api/login", { name: "personne", password: "x" });
  assert.equal(code(r), 401);
});

test("oauth discord : code valide", async () => {
  const r = await post("/api/oauth/discord", { code: "good-code" });
  assert.equal(code(r), 200);
  assert.equal(r.json.body.role, "USER");
  assert.equal(r.json.body.token.split(".").length, 3);
});

test("oauth discord : utilisateur inconnu", async () => {
  assert.equal(code(await post("/api/oauth/discord", { code: "unknown-user" })), 401);
});

test("oauth discord : mauvais code", async () => {
  assert.equal(code(await post("/api/oauth/discord", { code: "bad" })), 401);
});

test("oauth discord : corps vide", async () => {
  assert.equal(code(await post("/api/oauth/discord", {})), 400);
});

test("oauth twitch : code valide", async () => {
  const r = await post("/api/oauth/twitch", { code: "good-twitch" });
  assert.equal(code(r), 200);
  assert.equal(r.json.body.role, "USER");
});

test("oauth twitch : mauvais code", async () => {
  assert.equal(code(await post("/api/oauth/twitch", { code: "bad" })), 401);
});

test("oauth discord : un pseudo égal au nom de l'admin ne donne pas de session", async () => {
  const r = await post("/api/oauth/discord", { code: "admin-discord" });
  assert.equal(code(r), 401);
  assert.equal(r.json.body?.token, undefined);
});

test("oauth twitch : un login égal au nom de l'admin ne donne pas de session", async () => {
  const r = await post("/api/oauth/twitch", { code: "admin-twitch" });
  assert.equal(code(r), 401);
  assert.equal(r.json.body?.token, undefined);
});

test("oauth discord : réponse non JSON du fournisseur -> 502", async () => {
  assert.equal(code(await post("/api/oauth/discord", { code: "html-discord" })), 502);
});

test("oauth twitch : réponse non JSON du fournisseur -> 502", async () => {
  assert.equal(code(await post("/api/oauth/twitch", { code: "html-twitch" })), 502);
});

test("la page d'accueil expose l'identifiant public mais aucun secret", async () => {
  const html = await (await fetch(BASE + "/")).text();
  assert.ok(html.includes("fake-discord-id"), "client id absent");
  assert.ok(html.includes("service=discord"), "redirect discord absent");
  assert.ok(!html.includes("fake-discord-secret"), "secret discord dans le HTML");
  assert.ok(!html.includes("fake-twitch-secret"), "secret twitch dans le HTML");
  assert.ok(!html.includes("ClientSecret"), "clé ClientSecret dans le HTML");
});

test("/api/third-party/* n'existe plus (plus d'API qui révèle un nom)", async () => {
  const res = await fetch(BASE + "/api/third-party/admin");
  const type = res.headers.get("content-type") || "";
  // Nuxt sert la page d'accueil pour toute adresse inconnue : on vérifie qu'aucune réponse JSON n'est renvoyée.
  assert.ok(!type.includes("application/json"), `réponse JSON inattendue (${type})`);
  assert.ok(!(await res.text()).includes('"statusCode":200'));
});
