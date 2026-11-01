// Parcours navigateur (Playwright). Prérequis : site sur BASE_URL, faux OAuth sur 4500.
// PW_DIR : dossier où Playwright est installé (contient package.json et node_modules/playwright).
// Variables : BASE_URL, PW_DIR, SHOTS (dossier de captures), LABEL (préfixe des fichiers : avant|apres)
// La redirect_uri attendue est déduite de BASE_URL.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

if (!process.env.PW_DIR) {
  console.error("PW_DIR non défini (dossier d'installation de Playwright).");
  process.exit(2);
}
const require = createRequire(path.join(process.env.PW_DIR, "package.json"));
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const SHOTS = process.env.SHOTS || "./captures";
const LABEL = process.env.LABEL || "apres";
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const dialogs = [];
page.on("dialog", (d) => { dialogs.push(d.message()); d.accept(); });

// Aucun appel réseau réel : discord.com est simulé, tout hôte externe est coupé.
await context.route("**/*", (route) => {
  const u = new URL(route.request().url());
  if (u.hostname === "discord.com") {
    return route.fulfill({ contentType: "text/html", body: "<h1 style='font:24px sans-serif'>Faux Discord : page d'autorisation</h1>" });
  }
  if (u.hostname === "127.0.0.1" || u.hostname === "localhost") return route.continue();
  return route.abort();
});

const openLoginAndClickDiscord = async () => {
  await page.goto(BASE + "/");
  await page.waitForLoadState("networkidle");
  // Sur main, le store jwt démarre à {} (truthy) : le visiteur voit "Logout" au lieu de "Login".
  const login = page.getByRole("button", { name: "Login" });
  if ((await login.count()) === 0) {
    console.log("note : bouton Logout affiché à la place de Login (état initial du store jwt)");
    await page.getByRole("button", { name: "Logout" }).click();
  }
  await login.click();
  await page.getByText("Se connecter avec Discord").waitFor();
  await page.screenshot({ path: path.join(SHOTS, `${LABEL}-1-formulaire.png`) });
  await Promise.all([
    page.waitForURL(/discord\.com\/oauth2\/authorize/),
    page.getByText("Se connecter avec Discord").click(),
  ]);
};

let failures = 0;
const check = (name, fn) => {
  try { fn(); console.log("ok   -", name); } catch (e) { failures++; console.log("FAIL -", name, "\n      ", e.message.split("\n")[0]); }
};

await openLoginAndClickDiscord();
const authUrl = new URL(page.url());
console.log("URL d'autorisation :", page.url());
await page.screenshot({ path: path.join(SHOTS, `${LABEL}-2-discord-autorisation.png`) });
check("client_id = fake-discord-id", () => assert.equal(authUrl.searchParams.get("client_id"), "fake-discord-id"));
check("redirect_uri attendue", () => assert.equal(authUrl.searchParams.get("redirect_uri"), `${BASE}/?service=discord`));
check("state aléatoire présent et pas 'someUniqueState'", () => {
  const s = authUrl.searchParams.get("state");
  assert.ok(s && s !== "someUniqueState");
});

// Retour OAuth valide. Le state stocké en sessionStorage est lu sur la page d'origine.
await page.goBack();
await page.waitForLoadState("networkidle");
const state = await page.evaluate(() => sessionStorage.getItem("oauth_state"));
check("state stocké en sessionStorage = state de l'URL", () => assert.equal(state, authUrl.searchParams.get("state")));

const jwtOf = async () => {
  // pinia-plugin-persistedstate (nuxt) range le store dans un cookie nommé comme le store.
  const c = (await context.cookies(BASE)).find((x) => x.name === "jwt");
  if (!c) return null;
  try { return JSON.parse(decodeURIComponent(c.value)).jwt || null; } catch { return null; }
};

// Cas négatif : mauvais state, pas connecté, alerte visible, code retiré de l'URL.
dialogs.length = 0;
await page.goto(`${BASE}/?code=good-code&service=discord&state=autre`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);
const badJwt = await jwtOf();
check("mauvais state : pas connecté", () => assert.equal(badJwt, null));
check("mauvais state : alerte affichée", () =>
  assert.deepEqual(dialogs, ["Session de connexion invalide ou expirée, veuillez réessayer."]));
check("mauvais state : code retiré de l'URL", () => assert.ok(!page.url().includes("code=")));
await page.goBack().catch(() => {});
await page.waitForTimeout(500);
check("mauvais state : le code ne reste pas dans l'historique", () => assert.ok(!page.url().includes("code=")));

// State absent (sessionStorage vide) : même alerte.
dialogs.length = 0;
await page.goto(`${BASE}/?code=good-code&service=discord`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);
check("state absent : alerte affichée", () =>
  assert.deepEqual(dialogs, ["Session de connexion invalide ou expirée, veuillez réessayer."]));

// Refus de l'utilisateur chez le fournisseur : ?error=access_denied&service=discord, sans code.
for (const service of ["discord", "twitch"]) {
  dialogs.length = 0;
  await page.evaluate(() => sessionStorage.setItem("oauth_state", "x"));
  await page.goto(`${BASE}/?error=access_denied&error_description=refus&service=${service}&state=x`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  check(`refus ${service} : alerte « Connexion annulée. »`, () => assert.deepEqual(dialogs, ["Connexion annulée."]));
  check(`refus ${service} : URL nettoyée`, () => assert.equal(new URL(page.url()).search, ""));
  const left = await page.evaluate(() => sessionStorage.getItem("oauth_state"));
  check(`refus ${service} : oauth_state retiré`, () => assert.equal(left, null));
}

// Utilisateur inconnu : le serveur répond 401, alerte « inconnu », code absent de l'historique.
dialogs.length = 0;
await page.evaluate(() => sessionStorage.setItem("oauth_state", "x"));
await page.goto(`${BASE}/?code=unknown-user&service=discord&state=x`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);
const unknownJwt = await jwtOf();
check("utilisateur inconnu : pas connecté", () => assert.equal(unknownJwt, null));
check("utilisateur inconnu : alerte contenant « inconnu »", () => {
  assert.equal(dialogs.length, 1);
  assert.match(dialogs[0], /inconnu/);
});
await page.goBack().catch(() => {});
await page.waitForTimeout(500);
check("utilisateur inconnu : le code ne reste pas dans l'historique", () => assert.ok(!page.url().includes("code=")));

// Cas passant (le state a été consommé par l'essai précédent : on le repose).
await page.evaluate((st) => sessionStorage.setItem("oauth_state", st), state);
await page.goto(`${BASE}/?code=good-code&service=discord&state=${state}`);
await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: "Logout" }).waitFor({ timeout: 8000 }).catch(() => {});
await page.screenshot({ path: path.join(SHOTS, `${LABEL}-3-apres-retour-discord.png`) });
const jwt = await jwtOf();
check("succès : URL sans code ni state", () => assert.equal(new URL(page.url()).search, ""));
check("bon state : jwt à 3 segments dans le store persisté", () => assert.equal((jwt || "").split(".").length, 3));
const logout = await page.getByRole("button", { name: "Logout" }).count();
check("Logout présent", () => assert.equal(logout, 1));

await page.goBack().catch(() => {});
await page.waitForTimeout(500);
check("succès : le code ne reste pas dans l'historique", () => assert.ok(!page.url().includes("code=")));

await browser.close();
console.log(failures ? `${failures} échec(s)` : "tout est ok");
process.exit(failures ? 1 : 0);
