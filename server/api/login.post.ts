import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { name, password } = body ?? {};
  if (
    typeof name !== "string" ||
    !name ||
    typeof password !== "string" ||
    !password
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Nom d'utilisateur et mot de passe requis.",
    });
  }

  // Même réponse pour un nom inconnu ou un mot de passe faux. Un compte sans
  // mot de passe (Discord, Twitch) ne peut pas se connecter par cette route.
  const invalidCredentials = {
    statusCode: 401,
    statusMessage: "Identifiants incorrects.",
  };

  const user = await prisma.user.findUnique({
    where: { name },
    select: { id: true, password: true, role: true },
  });

  if (!user?.password || !(await bcrypt.compare(password, user.password))) {
    throw createError(invalidCredentials);
  }
  return createSession(user);
});
