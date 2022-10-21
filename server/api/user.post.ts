import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const password = await bcrypt.hash(body.password, 10);
  return {body, password};
});

export default createUser;