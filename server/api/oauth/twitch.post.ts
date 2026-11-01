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
  const { twitchClientId, twitchClientRedirect } = config.public;
  if (!twitchClientId || !config.twitchClientSecret || !twitchClientRedirect) {
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      message: "Connexion Twitch non configurée.",
    });
  }

  let login: string | undefined;
  try {
    const tokenRes = await fetch(`${config.oauth.twitchIdBase}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: twitchClientId,
        client_secret: config.twitchClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: twitchClientRedirect,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenRes.ok) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Échec de l'authentification Twitch.",
      });
    }
    const { access_token } = await tokenRes.json();

    const meRes = await fetch(`${config.oauth.twitchApiBase}/helix/users`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Client-Id": twitchClientId,
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!meRes.ok) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Profil Twitch inaccessible.",
      });
    }
    login = (await meRes.json())?.data?.[0]?.login;
    if (!login) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Profil Twitch incomplet.",
      });
    }
  } catch (e) {
    if (isError(e)) throw e;
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway",
      message: "Twitch injoignable, réessayez plus tard.",
    });
  }
  return loginByName(login!, "Twitch");
});
