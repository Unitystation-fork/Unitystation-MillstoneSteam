import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = defineEventHandler(async (event) => {
try {
  const users = await prisma.user.findMany({});
  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
} catch (error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: "User could not be found" }),
  }
}
  

});

export default users;