export default defineEventHandler(async (event) => {
  const { code } = (await readBody(event).catch(() => ({}))) ?? {};
  if (typeof code !== "string" || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Code OAuth manquant.",
    });
  }
  const config = useRuntimeConfig(event);
  const { discordClientId, discordClientRedirect } = config.public;
  if (!discordClientId || !config.discordClientSecret || !discordClientRedirect) {
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      message: "Connexion Discord non configurée.",
    });
  }

  let username: string | undefined;
  try {
    const tokenRes = await fetch(`${config.oauth.discordApiBase}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: discordClientRedirect,
        client_id: discordClientId,
        client_secret: config.discordClientSecret,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenRes.ok) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Échec de l'authentification Discord.",
      });
    }
    const { access_token } = await tokenRes.json();

    const meRes = await fetch(`${config.oauth.discordApiBase}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` },
      signal: AbortSignal.timeout(10_000),
    });
    if (!meRes.ok) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Profil Discord inaccessible.",
      });
    }
    username = (await meRes.json())?.username;
    if (!username) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Profil Discord incomplet.",
      });
    }
  } catch (e) {
    if (isError(e)) throw e;
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway",
      message: "Discord injoignable, réessayez plus tard.",
    });
  }
  return loginByName(username!, "Discord");
});
