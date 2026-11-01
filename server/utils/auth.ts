import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Crée le jeton de session (5 h) et le range en base.
export async function createSession(user: { id: number; role: string }) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "5h",
  });
  await prisma.user.update({ where: { id: user.id }, data: { token } });
  return {
    statusCode: 200,
    body: { message: "Login successful", token, role: user.role },
  };
}

// Connexion d'un compte déjà invité (name = pseudo Discord / login Twitch), sans mot de passe :
// l'identité a été prouvée côté serveur auprès du fournisseur OAuth.
export async function loginByName(name: string, providerLabel: string) {
  const user = await prisma.user.findUnique({
    where: { name },
    select: { id: true, role: true },
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: `Utilisateur ${providerLabel} inconnu.`,
    });
  }
  // Un pseudo Discord/Twitch ne doit jamais ouvrir une session administrateur.
  if (user.role === "ADMIN") {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Ce compte se connecte par mot de passe.",
    });
  }
  return createSession(user);
}
