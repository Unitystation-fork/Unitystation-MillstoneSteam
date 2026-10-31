import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

const login = defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, password } = body;

  // Même réponse pour un nom inconnu ou un mot de passe faux. Un compte sans
  // mot de passe (Discord, Twitch) ne peut pas se connecter par cette route.
  const invalidCredentials = {
    statusCode: 401,
    statusMessage: "Identifiants incorrects.",
  };

  if (typeof name !== "string" || typeof password !== "string") {
    throw createError(invalidCredentials);
  }

  const user = await prisma.user.findUnique({
    where: { name: name },
    select: { id: true, password: true, role: true },
  });

  if (!user?.password || !(await bcrypt.compare(password, user.password))) {
    throw createError(invalidCredentials);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "5h",
  });
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token,
    },
  });
  return {
    statusCode: 200,
    body: { message: "Login successful", token: token, role: user.role },
  };
});

export default login;
