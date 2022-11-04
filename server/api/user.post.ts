import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = defineEventHandler(async (event) => {
  // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const name = body.name;
  const password = await bcrypt.hash(body.password, 10);
  const auth = event.req.headers.authorization;
  const token = (auth !== undefined) ?  auth.split(" ")[1] : null;
try {
  // verify the token validity
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
    }
  });
  if (!user) {
    throw "User not found";
  }
  //check if user is admin
  if (user.role !== "ADMIN") {
    throw "You do not have the permission to create users";
  }
  // check required infos are present
  if(!name || !password) {
    throw "Name or password missing";
  }
  // check if user already exists
  const userToCreate = await prisma.user.findUnique({
    where: {
      name: name, 
    }
  });
  if(userToCreate) {
    throw "User already exists";
  }
    // create the user with provided name and password
  const createdUser = await prisma.user.create({
    data: {
      name: name,
      password: password,
    }
  });
  return {
    statusCode: 200,
    body: {message: "User created", user : createdUser },
  };
} catch (error) {
  return {
    statusCode: 500,
    body:{ message: "User could not be created", error: error },
  }
}
  

});

export default createUser;