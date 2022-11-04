import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

const editUser = defineEventHandler(async (event) => {
  // get id from the request parameters
  const id = parseInt(event.context.params.id);
  // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const name = (body.name) ? body.name : null;
  const password = (body.password) ? bcrypt.hashSync(body.password, 10) : null;
  const role = (body.role) ? body.role.toString().toUpperCase() : null;

  //get the token from the request headers
  const auth = event.req.headers.authorization;
  const token = (auth !== undefined) ?  auth.split(" ")[1] : null;
  try {
    //check if user id is given
    if (!id) {
      throw "No id provided";
    }
    // verify the token and get the user id from it
    if (!token) {
      throw "No token provided";
    }
    const decoded: string | JwtPayload = jwt.verify(token, "shhhhhhh");
    if (!decoded) {
      throw "Invalid token.";
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
      throw "You do not have the permission to edit users";
    }
    // check if the user exists and throw an error if it doesn't
    const userToEdit = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userToEdit) {
      throw "User does not exist";
    }
    // update the user with infos from the request body if they are not null
    // if they are null, the user will be updated with actual values
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name : (name) ? name : userToEdit.name,
        password : (password) ? password : userToEdit.password,
        role: (role) ? role : userToEdit.role,
        updatedAt: new Date(),
      },
    });
    return {
      statusCode: 200,
      body: { message: "User updated", user : updatedUser },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: { message: "User could not be updated", error: error },
    };
  }
});

export default editUser;