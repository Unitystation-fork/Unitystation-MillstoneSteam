/**
 * user.post.ts contient la gestion de la création d'utilisateurs.
 * Lorsqu'une demande POST est reçue, ce gestionnaire vérifie les autorisations,
 * vérifie si les informations nécessaires sont fournies, puis crée un nouvel utilisateur dans DB.
 * Prisma pour la base de données,
 * JWT pour l'authentification.
 */

import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = body.name;
  const role = body.role;
  const password = await bcrypt.hash(body.password, 10);
  const discordId = body.discordId;
  const twitchId = body.twitchId;
  const auth = event.node.req.headers.authorization;
  const token = auth !== undefined ? auth.split(" ")[1] : null;
  try {
    // vérifiez la validité du jeton
    if (!token) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    if (!decoded || typeof decoded === "string") {
      throw "Invalid token";
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw "User not found";
    }
    if (user.role !== "ADMIN") {
      throw "You do not have permission to create users";
    }
    if (!name || !password) {
      throw "Name or password missing";
    }
    const userToCreate = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    if (userToCreate) {
      throw "User already exists";
    }
    const createdUser = await prisma.user.create({
      data: {
        name: name,
        password: password,
        role: role,
        discordId: discordId,
        twitchId: twitchId,
      },
    });
    return {
      statusCode: 200,
      body: { message: "User created", user: createdUser },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: "User could not be created", error: error },
    };
  }
});

export default createUser;
