import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

const login = defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, password } = body;

  const user = await prisma.user.findUnique({
    where: { name: name },
    select: { id: true, password: true, role: true },
  });

  if (!user) {
    throw {
      statusCode: 401,
      statusMessage: "Utilisateur inconnu.",
    };
  }
  // Discord user login without password

  if (password) {
    const isPasswordCorrect =  bcrypt.compare(password, user.password!);
    
    if (!isPasswordCorrect) {
      throw {
        statusCode: 401,
        statusMessage: "Mot de passe incorrect.",
      };
    }
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
