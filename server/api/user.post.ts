import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = defineEventHandler(async (event) => {
  // get the body of the request and asign its parameters to variables
  const body = await readBody(event);
  const name = body.name;
  const password = await bcrypt.hash(body.password, 10);
try {
  // check required infos are present
  if(!name || !password) {
    throw "Name or password missing";
  }
  // check if user already exists
  const user = await prisma.user.findUnique({
    where: {
      name: name, 
    }
  });
  if(user) {
    throw "User already exists";
  }
    // create the user with provided name and password
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
    body:{ message: "User could not be created", error: error },
  }
}
  

});

export default createUser;