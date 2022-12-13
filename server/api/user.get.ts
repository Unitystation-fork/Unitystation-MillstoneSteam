import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = defineEventHandler(async (event) => {
  const auth = event.req.headers.authorization;
  const token = auth !== undefined ? auth.split(" ")[1] : null;
  try {
    // verify the token and extract the user id from it
    if (!token) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(token, "shhhhhhh");
    if (!decoded || typeof decoded === "string") {
      throw "Invalid token";
    }
    const id = decoded.id;
    // check if the user exists and throw an error if it doesn't
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw "User not found";
    }
    //check if user is admin
    if (user.role !== "ADMIN") {
      throw "You do not have the permission to get all users";
    }
    // get all users from the database and return them
    const users = await prisma.user.findMany({});
    return {
      statusCode: 200,
      body: { users },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: "User could not be found", error: error },
    };
  }
});

export default users;
