import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = body.name;
  const password = await bcrypt.hash(body.password, 10);
try {
  await prisma.user.create({
    data: {
      name: name,
      password: password,
    }
  });
  return {
    statusCode: 200,
    body: JSON.stringify("User created"),
  };
} catch (error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: "User could not be created" }),
  }
}
  

});

export default createUser;