import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = defineEventHandler(async (event) => {
  const auth = event.req.headers.authorization;
  const token = auth !== undefined ? auth.split(" ")[1] : null;
  try {
    // verify the token and extract the user id from it
    if (!token || token === null) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET);
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
    const users = await prisma.user.findMany({
       select: {
         name: true,
         id: true,
         role: true,
      } 
    });
    return {
      statusCode: 200,
      body: { users },
    };
  } catch (e) {
    console.log(e);
    if(e.name ==="JsonWebTokenError"){
      return { statusCode: 401, body: { error: "Invalid token" } };
    }
    if(e.name==="TokenExpiredError"){
      return { statusCode: 401, body: { error: "Expired token" } };
     }
    return {
      statusCode: 500,
      body: { message: "User could not be found", error: e },
    };
  }
});

export default users;
