import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = defineEventHandler(async (event) => {
try {
  // get all users from the database and return them
  const users = await prisma.user.findMany({});
  return {
    statusCode: 200,
    body: {users},
  };
} catch (error) {
  return {
    statusCode: 500,
    body: { message: "User could not be found", error: error },
  }
}
  

});

export default users;