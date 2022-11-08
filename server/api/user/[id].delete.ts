import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();

const deleteUser = defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  const auth = event.req.headers.authorization;
  const token = (auth !== undefined) ?  auth.split(" ")[1] : null;
  try {
    //check if id is given
    if (!id) {
      throw "No id provided";
    }
    // verify the token and get the user id from it
    if (!token) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(token, "shhhhhhh");
    if (!decoded) {
      throw "Invalid token";
    }
    // check if the user exists and throw an error if it doesn't
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw "User not found";
    }
    //check if user is admin
    if (user.role !== "ADMIN") {
      throw "You do not have the permission to delete users";
    }
    // check if the user exists and throw an error if it doesn't
    const userToDelete = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userToDelete) {
      throw "User does not exist";
    }
    // delete the user
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return {
      statusCode: 200,
      body: { message: "User deleted", user: deletedUser.name},
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: { message: "User could not be deleted", error: error },
    };
  }
});

export default deleteUser;